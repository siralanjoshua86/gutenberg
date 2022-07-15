/**
 * WordPress dependencies
 */
import { __experimentalBlockPatternsList as BlockPatternsList } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Modal } from '@wordpress/components';
import { useAsyncList } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import createTemplatePartId from '../utils/create-template-part-id';
import {
	useAlternativeBlockPatterns,
	useAlternativeTemplateParts,
	useTemplatePartArea,
} from '../utils/hooks';

/**
 * Convert template part (wp_template_part posts) to a pattern format accepted
 * by the `BlockPatternsList` component.
 *
 * @param {Array} templateParts An array of wp_template_part posts.
 *
 * @return {Array} Template parts as patterns.
 */
const convertTemplatePartsToPatterns = ( templateParts ) =>
	templateParts?.map( ( templatePart ) => ( {
		name: createTemplatePartId( templatePart.theme, templatePart.slug ),
		title: templatePart.title.rendered,
		blocks: parse( templatePart.content.raw ),
		templatePart,
	} ) );

export default function TemplatePartSelectionModal( {
	area,
	rootClientId,
	templatePartId,
	onTemplatePartSelect,
	onPatternSelect,
	onClose,
} ) {
	const areaType = useTemplatePartArea( area );
	const templatePartAreaLabel =
		areaType?.label.toLowerCase() ?? __( 'template part' );

	const { templateParts } = useAlternativeTemplateParts(
		area,
		templatePartId
	);
	const templatePartPatterns = useMemo(
		() => convertTemplatePartsToPatterns( templateParts ),
		[ templateParts ]
	);
	const shownTemplatePartPatterns = useAsyncList( templatePartPatterns );

	const patterns = useAlternativeBlockPatterns( area, rootClientId );
	const shownPatterns = useAsyncList( patterns );

	return (
		<Modal
			overlayClassName="block-editor-template-part__selection-modal"
			title={ sprintf(
				// Translators: %s as template part area title ("Header", "Footer", etc.).
				__( 'Choose a %s' ),
				templatePartAreaLabel
			) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ onClose }
		>
			{ !! templateParts?.length && (
				<div>
					<h2>
						{ sprintf(
							// Translators: %s as template part area title ("Header", "Footer", etc.).
							__( 'Existing %s' ),
							templatePartAreaLabel
						) }
					</h2>
					<BlockPatternsList
						blockPatterns={ templatePartPatterns }
						shownPatterns={ shownTemplatePartPatterns }
						onClickPattern={ onTemplatePartSelect }
					/>
				</div>
			) }
			{ !! patterns?.length && (
				<>
					<h2>{ __( 'Patterns' ) }</h2>
					<BlockPatternsList
						blockPatterns={ patterns }
						shownPatterns={ shownPatterns }
						onClickPattern={ onPatternSelect }
					/>
				</>
			) }
		</Modal>
	);
}
