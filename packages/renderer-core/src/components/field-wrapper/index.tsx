/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { useSwipeable } from 'react-swipeable';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { useFieldRenderContext } from '../field-render/context';
import FieldContent from '../field-content';

const FieldWrapper = ( { isFocused, setCanGoNext, setCanGoPrev, next } ) => {
	const { id, isActive, shouldBeRendered } = useFieldRenderContext();

	const { swiper } = useSelect( ( select ) => {
		return {
			swiper: select( 'quillForms/renderer-core' ).getSwiperState(),
		};
	} );

	const { walkPath, currentBlockId, isSubmissionScreenActive } = swiper;

	const fieldIndex = walkPath.findIndex( ( field ) => field.id === id );

	const currentFieldIndex = walkPath.findIndex(
		( $field ) => $field.id === currentBlockId
	);

	const position = isActive
		? null
		: currentFieldIndex > fieldIndex || isSubmissionScreenActive
		? 'is-up'
		: 'is-down';

	const ref = useRef();
	let timer = null;

	const handlers = useSwipeable( {
		onSwiped: () => {
			// // // console.log("onSwiped");
		},
		onSwipedUp: () => {
			// // // console.log("onSwipeUp");
		},
		onSwiping: () => {
			// // // console.log("onSwiping");
		},
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	} );

	useEffect( () => {
		if ( isActive ) {
			if ( ref?.current ) {
				setTimeout( () => {
					if ( ref?.current ) {
						ref.current.scrollTo( 0, 0 );
					}
				}, 0 );
			}
		}

		return () => {
			clearTimeout( timer );
			// setCanGoNext( true );
			// setCanGoPrev( true );
		};
	}, [ isActive ] );

	return (
		<div
			{ ...handlers }
			tabIndex={ 0 }
			className={ classnames(
				'renderer-components-field-wrapper',
				{
					active: isActive,
				},
				position ? position : ''
			) }
			onScroll={ ( e ) => {
				e.preventDefault();
				if ( ref.current.scrollTop === 0 ) {
					timer = setTimeout( () => {
						setCanGoPrev( true );
					}, 500 );
				} else {
					setCanGoPrev( false );
				}
				if (
					ref.current.scrollHeight - ref.current.clientHeight ===
					ref.current.scrollTop
				) {
					timer = setTimeout( () => {
						setCanGoNext( true );
					}, 500 );
				} else {
					setCanGoNext( false );
				}
			} }
		>
			{ shouldBeRendered && (
				<section id={ 'block-' + id }>
					<div
						className="renderer-components-field-wrapper__content-wrapper"
						ref={ ref }
					>
						<FieldContent isFocused={ isFocused } next={ next } />
					</div>
				</section>
			) }
		</div>
	);
};
export default FieldWrapper;