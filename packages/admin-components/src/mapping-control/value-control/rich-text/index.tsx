/**
 * QuillForms Dependencies
 */
import { MergeTags, RichTextControl } from '../../../rich-text';

/**
 * WordPress Dependencies
 */

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import { useMappingValueControlContext } from '../context';

interface Props {}

const RichText: React.FC< Props > = ( {} ) => {
	const {
		// sections,
		options,
		value,
		onChange,
		// isToggleEnabled,
	} = useMappingValueControlContext();

	let tags: MergeTags = [];
	for ( const option of options ) {
		if ( option.isMergeTag ) {
			tags.push( {
				type: option.type,
				modifier: option.value,
				label: option.label,
				icon: option.iconBox?.icon,
				color: option.iconBox?.color,
			} );
		}
	}

	return (
		<div className="mapping-value-control-rich-text">
			<RichTextControl
				value={ value.value ?? '' }
				setValue={ ( value ) => onChange( { type: 'text', value } ) }
				mergeTags={ tags }
			/>
		</div>
	);
};

export default RichText;