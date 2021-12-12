/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { doAction } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { cloneDeep, map, omit, size } from 'lodash';

/**
 * Internal Dependencies
 */
import useEditableFields from '../../hooks/use-editable-fields';
import FormFlow from '../form-flow';
import useBlocks from '../../hooks/use-blocks';
import type { Screen } from '../../store/types';
import useFormContext from '../../hooks/use-form-context';

interface Props {
	applyLogic: boolean;
}
const FormWrapper: React.FC< Props > = ( { applyLogic } ) => {
	const editableFields = useEditableFields();
	const blocks = useBlocks();
	const { isPreview } = useFormContext();
	const {
		setSwiper,
		insertEmptyFieldAnswer,
		goToBlock,
		setPaymentData,
	} = useDispatch( 'quillForms/renderer-core' );

	useEffect( () => {
		if ( ! isPreview ) {
			editableFields.forEach( ( field ) =>
				insertEmptyFieldAnswer( field.id, field.name )
			);
			const firstBlock = blocks && blocks[ 0 ] ? blocks[ 0 ] : undefined;
			const welcomeScreens = map(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'welcome-screen'
				),
				( block ) => omit( block, [ 'name' ] )
			) as [  ] | Screen[];

			const thankyouScreens = map(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'thankyou-screen'
				),
				( block ) => omit( block, [ 'name' ] )
			) as [  ] | Screen[];
			setSwiper( {
				walkPath: cloneDeep(
					blocks.filter(
						( block ) =>
							block.name !== 'thankyou-screen' &&
							block.name !== 'welcome-screen'
					)
				),
				welcomeScreens:
					size( welcomeScreens ) === 0
						? []
						: ( welcomeScreens as Screen[] ),
				thankyouScreens:
					size( thankyouScreens ) === 0
						? []
						: ( thankyouScreens as Screen[] ),
			} );

			const urlParams = new URLSearchParams( window.location.search );
			const isPaymentStep = urlParams.get( 'step' ) === 'payment';

			let completed = false;
			if ( isPaymentStep ) {
				doAction(
					'QuillForms.RendererCore.PaymentStep',
					urlParams,
					() => {
						completed = true;
						goToBlock(
							window[ 'pending_submission' ].thankyou_screen_id
						);
					},
					() => {
						setPaymentData( window[ 'pending_submission' ] );
					}
				);
			}

			if ( ! completed ) {
				setTimeout( () => {
					if ( firstBlock?.id ) {
						goToBlock( firstBlock.id );
					}
				}, 100 );
			}
		}
	}, [] );

	return <FormFlow applyLogic={ applyLogic } />;
};

export default FormWrapper;
