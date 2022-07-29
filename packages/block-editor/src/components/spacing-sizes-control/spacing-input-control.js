/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import {
	Button,
	RangeControl,
	CustomSelectControl,
	__experimentalUnitControl as UnitControl,
	__experimentalVStack as VStack,
	__experimentalText as Text,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import useSetting from '../use-setting';
import {
	LABELS,
	getSliderValueFromPreset,
	getCustomValueFromPreset,
	isValueSpacingPreset,
} from './utils';

export default function SpacingInputControl( {
	spacingSizes,
	value,
	side,
	onChange,
	isMixed = false,
	type,
} ) {
	const [ showCustomValueControl, setShowCustomValueControl ] = useState(
		value !== undefined && ! isValueSpacingPreset( value )
	);

	const [ valueNow, setValueNow ] = useState( null );

	const units = useCustomUnits( {
		availableUnits: useSetting( 'spacing.units' ) || [ 'px', 'em', 'rem' ],
	} );

	let currentValue;

	if ( isMixed ) {
		currentValue = null;
	} else {
		currentValue = ! showCustomValueControl
			? getSliderValueFromPreset( value, spacingSizes )
			: getCustomValueFromPreset( value, spacingSizes );
	}

	const selectedUnit =
		useMemo(
			() => parseQuantityAndUnitFromRawValue( currentValue ),
			[ currentValue ]
		)[ 1 ] || units[ 0 ].value;

	const customTooltipContent = ( newValue ) => spacingSizes[ newValue ]?.name;

	const customRangeValue = parseInt( currentValue );

	const getNewCustomValue = ( newSize ) => {
		const isNumeric = ! isNaN( parseFloat( newSize ) );
		const nextValue = isNumeric ? newSize : undefined;
		return nextValue;
	};

	const getNewPresetValue = ( newSize ) => {
		setValueNow( newSize );
		const size = parseInt( newSize, 10 );
		if ( size === 0 ) {
			return undefined;
		}
		if ( size === 1 ) {
			return '0';
		}
		return `var:preset|spacing|${ spacingSizes[ newSize ]?.slug }`;
	};

	const handleCustomValueSliderChange = ( next ) => {
		onChange(
			next !== undefined ? `${ next }${ selectedUnit }` : undefined
		);
	};

	const allPlaceholder = isMixed ? __( 'Mixed' ) : null;

	const currentValueHint = ! isMixed
		? customTooltipContent( currentValue )
		: __( 'Mixed' );

	const options = spacingSizes.map( ( size, index ) => ( {
		key: index,
		name: size.name,
	} ) );

	const marks = spacingSizes.map( ( newValue, index ) => ( {
		value: index,
		label: undefined,
	} ) );

	const ariaLabel = sprintf(
		// translators: 1: The side of the block being modified (top, bottom, left, etc.). 2. Type of spacing being modified (Padding, margin, etc)
		__( '%1$s %2$s' ),
		LABELS[ side ],
		type?.toLowerCase()
	);

	return (
		<>
			{ side !== 'all' && (
				<VStack className="components-spacing-sizes-control__side-labels">
					<Text className="components-spacing-sizes-control__side-label">
						{ LABELS[ side ] }
					</Text>

					{ spacingSizes.length <= 9 && ! showCustomValueControl && (
						<Text className="components-spacing-sizes-control__hint-single">
							{ currentValueHint !== undefined
								? currentValueHint
								: __( 'Default' ) }
						</Text>
					) }
				</VStack>
			) }
			{ side === 'all' &&
				spacingSizes.length <= 9 &&
				! showCustomValueControl && (
					<Text className="components-spacing-sizes-control__hint-all">
						{ currentValueHint !== undefined
							? currentValueHint
							: __( 'Default' ) }
					</Text>
				) }

			<Button
				label={
					showCustomValueControl
						? __( 'Use size preset' )
						: __( 'Set custom size' )
				}
				icon={ settings }
				onClick={ () => {
					setShowCustomValueControl( ! showCustomValueControl );
				} }
				isPressed={ showCustomValueControl }
				isSmall
				className={ classnames( {
					'components-spacing-sizes-control__custom-toggle-all':
						side === 'all',
					'components-spacing-sizes-control__custom-toggle-single':
						side !== 'all',
				} ) }
			/>
			{ showCustomValueControl && (
				<>
					<UnitControl
						onChange={ ( newSize ) =>
							onChange( getNewCustomValue( newSize ) )
						}
						value={ currentValue }
						units={ units }
						placeholder={ allPlaceholder }
						disableUnits={ isMixed }
						label={ ariaLabel }
						hideLabelFromVision={ true }
					/>

					<RangeControl
						value={ customRangeValue }
						min={ 0 }
						max={ 100 }
						withInputField={ false }
						onChange={ handleCustomValueSliderChange }
						className="components-spacing-sizes-control__custom-value-range"
					/>
				</>
			) }
			{ spacingSizes.length <= 9 && ! showCustomValueControl && (
				<RangeControl
					className="components-spacing-sizes-control__range-control"
					value={ currentValue }
					onChange={ ( newSize ) =>
						onChange( getNewPresetValue( newSize ) )
					}
					withInputField={ false }
					aria-valuenow={ valueNow }
					aria-valuetext={ spacingSizes[ valueNow ]?.name }
					renderTooltipContent={ customTooltipContent }
					min={ 0 }
					max={ spacingSizes.length - 1 }
					marks={ marks }
					label={ ariaLabel }
					hideLabelFromVision={ true }
				/>
			) }
			{ spacingSizes.length > 9 && ! showCustomValueControl && (
				<CustomSelectControl
					className="components-spacing-sizes-control__custom-select-control"
					value={
						options.find(
							( option ) => option.key === currentValue
						) || '' // passing undefined here causes a downshift controlled/uncontrolled warning
					}
					onChange={ ( selection ) => {
						onChange(
							getNewPresetValue( selection.selectedItem.key )
						);
					} }
					options={ options }
					label={ ariaLabel }
					hideLabelFromVision={ true }
				/>
			) }
		</>
	);
}
