/**
 * WordPress dependencies
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import TemplatePartSelectionModal from '../components/selection-modal';
import { useCreateTemplatePartFromBlocks } from '../utils/hooks';

export default function EditSelectionModal( {
	setAttributes,
	onClose,
	templatePartId = null,
	area,
	clientId,
	rootClientId,
} ) {
	// When the templatePartId is undefined,
	// it means the user is creating a new one from the placeholder.
	const isReplacingTemplatePartContent = !! templatePartId;
	const { createSuccessNotice } = useDispatch( noticesStore );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	const onTemplatePartSelect = useCallback( ( templatePart ) => {
		setAttributes( {
			slug: templatePart.slug,
			theme: templatePart.theme,
			area: undefined,
		} );
		createSuccessNotice(
			sprintf(
				/* translators: %s: template part title. */
				__( 'Template Part "%s" inserted.' ),
				templatePart.title?.rendered || templatePart.slug
			),
			{
				type: 'snackbar',
			}
		);
		onClose();
	}, [] );

	const createFromBlocks = useCreateTemplatePartFromBlocks(
		area,
		setAttributes
	);

	return (
		<TemplatePartSelectionModal
			area={ area }
			rootClientId={ rootClientId }
			templatePartId={ templatePartId }
			onTemplatePartSelect={ ( pattern ) => {
				onTemplatePartSelect( pattern.templatePart );
			} }
			onPatternSelect={ ( pattern, blocks ) => {
				if ( isReplacingTemplatePartContent ) {
					replaceInnerBlocks( clientId, blocks );
				} else {
					createFromBlocks( blocks, pattern.title );
				}

				onClose();
			} }
			onClose={ onClose }
		/>
	);
}
