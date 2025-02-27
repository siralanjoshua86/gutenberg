/**
 * External dependencies
 */
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import { COLORS, CONFIG } from '../../utils';
import { space } from '../../ui/utils/space';
import {
	Input,
	BackdropUI,
} from '../../input-control/styles/input-control-styles';
import NumberControl from '../../number-control';
import SelectControl from '../../select-control';
import { Select } from '../../select-control/styles/select-control-styles';

export const Wrapper = styled.div`
	font-size: ${ CONFIG.fontSize };
`;

export const Fieldset = styled.fieldset`
	border: 0;
	margin: 0 0 ${ space( 2 * 2 ) } 0;
	padding: 0;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const Legend = styled.legend`
	margin-bottom: ${ space( 2 ) };
	padding: 0;
`;

export const TimeWrapper = styled.div`
	direction: ltr;
	display: flex;
`;

const baseInput = css`
	&&& ${ Input } {
		padding-left: ${ space( 2 ) };
		padding-right: ${ space( 2 ) };
		text-align: center;
	}
`;

export const HoursInput = styled( NumberControl )`
	${ baseInput }

	width: ${ space( 9 ) };

	&&& ${ Input } {
		padding-right: 0;
	}

	&&& ${ BackdropUI } {
		border-right: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`;

export const TimeSeparator = styled.span`
	border-top: ${ CONFIG.borderWidth } solid ${ COLORS.gray[ 700 ] };
	border-bottom: ${ CONFIG.borderWidth } solid ${ COLORS.gray[ 700 ] };
	line-height: calc(
		${ CONFIG.controlHeight } - ${ CONFIG.borderWidth } * 2
	);
	display: inline-block;
`;

export const MinutesInput = styled( NumberControl )`
	${ baseInput }

	width: ${ space( 9 ) };

	&&& ${ Input } {
		padding-left: 0;
	}

	&&& ${ BackdropUI } {
		border-left: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
`;

// Ideally we wouldn't need a wrapper, but can't otherwise target the
// <BaseControl> in <SelectControl>
export const MonthSelectWrapper = styled.div`
	flex-grow: 1;
`;

export const MonthSelect = styled( SelectControl )`
	height: 36px;

	${ Select } {
		line-height: 30px;
	}
`;

export const DayInput = styled( NumberControl )`
	${ baseInput }

	width: ${ space( 9 ) };
`;

export const YearInput = styled( NumberControl )`
	${ baseInput }

	width: ${ space( 14 ) };
`;

export const TimeZone = styled.div`
	text-decoration: underline dotted;
`;
