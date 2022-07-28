/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import { __, _x, isRTL } from '@wordpress/i18n';
import {
	ToolbarButton,
	ToggleControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	DropZone,
	Popover,
} from '@wordpress/components';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	useSetting,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useMergeRefs } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import { formatLtr } from '@wordpress/icons';
import { createBlobURL } from '@wordpress/blob';

/**
 * Internal dependencies
 */
import { useOnEnter } from './use-enter';

const name = 'core/paragraph';

function ParagraphRTLControl( { direction, setDirection } ) {
	return (
		isRTL() && (
			<ToolbarButton
				icon={ formatLtr }
				title={ _x( 'Left to right', 'editor button' ) }
				isActive={ direction === 'ltr' }
				onClick={ () => {
					setDirection( direction === 'ltr' ? undefined : 'ltr' );
				} }
			/>
		)
	);
}

function ParagraphBlock( {
	attributes,
	mergeBlocks,
	onReplace,
	onRemove,
	setAttributes,
	clientId,
} ) {
	const { align, content, direction, dropCap, placeholder } = attributes;
	const isDropCapFeatureEnabled = useSetting( 'typography.dropCap' );
	const ref = useRef();
	const blockProps = useBlockProps( {
		ref: useMergeRefs( [ useOnEnter( { clientId, content } ), ref ] ),
		className: classnames( {
			'has-drop-cap': dropCap,
			[ `has-text-align-${ align }` ]: align,
		} ),
		style: { direction },
	} );
	const { replaceBlock } = useDispatch( blockEditorStore );

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ align }
					onChange={ ( newAlign ) =>
						setAttributes( { align: newAlign } )
					}
				/>
				<ParagraphRTLControl
					direction={ direction }
					setDirection={ ( newDirection ) =>
						setAttributes( { direction: newDirection } )
					}
				/>
			</BlockControls>
			{ isDropCapFeatureEnabled && (
				<InspectorControls __experimentalGroup="typography">
					<ToolsPanelItem
						hasValue={ () => !! dropCap }
						label={ __( 'Drop cap' ) }
						onDeselect={ () =>
							setAttributes( { dropCap: undefined } )
						}
						resetAllFilter={ () => ( { dropCap: undefined } ) }
						panelId={ clientId }
					>
						<ToggleControl
							label={ __( 'Drop cap' ) }
							checked={ !! dropCap }
							onChange={ () =>
								setAttributes( { dropCap: ! dropCap } )
							}
							help={
								dropCap
									? __( 'Showing large initial letter.' )
									: __(
											'Toggle to show a large initial letter.'
									  )
							}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			) }
			{ ! content && (
				<Popover
					anchorRef={ ref.current }
					animate={ false }
					position="top right left"
					focusOnMount={ false }
					__unstableForcePosition
					className="wp-block-paragraph__drop_zone"
				>
					<DropZone
						style={ {
							// TODO: Ideally we should observe the size of the paragraph block.
							width: ref.current?.offsetWidth,
							height: ref.current?.offsetHeight,
						} }
						onFilesDrop={ ( files ) => {
							if ( files.length === 1 ) {
								replaceBlock(
									clientId,
									createBlock( 'core/image', {
										url: createBlobURL( files[ 0 ] ),
									} )
								);
							}

							// TODO: We can handle other file types and sizes here.
						} }
					/>
				</Popover>
			) }
			<RichText
				identifier="content"
				tagName="p"
				{ ...blockProps }
				value={ content }
				onChange={ ( newContent ) =>
					setAttributes( { content: newContent } )
				}
				onSplit={ ( value, isOriginal ) => {
					let newAttributes;

					if ( isOriginal || value ) {
						newAttributes = {
							...attributes,
							content: value,
						};
					}

					const block = createBlock( name, newAttributes );

					if ( isOriginal ) {
						block.clientId = clientId;
					}

					return block;
				} }
				onMerge={ mergeBlocks }
				onReplace={ onReplace }
				onRemove={ onRemove }
				aria-label={
					content
						? __( 'Paragraph block' )
						: __(
								'Empty block; start writing or type forward slash to choose a block'
						  )
				}
				data-empty={ content ? false : true }
				placeholder={ placeholder || __( 'Type / to choose a block' ) }
				__unstableEmbedURLOnPaste
				__unstableAllowPrefixTransformations
			/>
		</>
	);
}

export default ParagraphBlock;
