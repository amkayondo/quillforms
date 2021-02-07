/**
 * QuillForms Dependencies
 */
import { useTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState } from 'react';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import tinyColor from 'tinycolor2';
import { css } from 'emotion';

const ChoiceItem = ( { choice, val, clickHandler } ) => {
	const [ isBeingSelected, setIsBeingSelected ] = useState( false );
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
	let timer;
	const isSelected = !! val && val === choice.value;
	return (
		<div
			className={ classnames(
				'dropdown__choiceWrapper',
				{
					selected: isSelected,
					isBeingSelected,
				},
				css`
					background: ${answersColor.setAlpha( 0.1 ).toString()};

					border-color: ${theme.answersColor};
					color: ${theme.answersColor};

					&:hover {
						background: ${answersColor.setAlpha( 0.2 ).toString()};
					}

					&.selected {
						background: ${tinyColor( theme.answersColor )
							.setAlpha( 0.75 )
							.toString()};
						color: ${tinyColor( theme.answersColor ).isDark()
							? '#fff'
							: tinyColor( theme.answersColor )
									.darken( 20 )
									.toString()};
					}
				`
			) }
			role="presentation"
			onClick={ () => {
				if ( isSelected ) {
					clearTimeout( timer );
				}
				if ( ! isSelected ) setIsBeingSelected( true );
				clickHandler();
				timer = setTimeout( () => {
					if ( isBeingSelected ) setIsBeingSelected( false );
				}, 400 );
			} }
		>
			{ choice.label }
		</div>
	);
};

export default ChoiceItem;