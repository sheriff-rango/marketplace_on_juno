import styled from "styled-components";
import Modal from "styled-react-modal";
import Button from "../Button";
import Text from "../Text";
import ToggleButton from "../ToggleButton";

export const StyledModal = Modal.styled`
	background: white;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border: 1px solid #02e296;
	border-radius: 15px;
	padding: 16px;
	position: absolute;
	top: 10%;
	@media only screen and (max-width: 768px) {
		width: calc(90% - 16px);
	}
	width: 620px;
  	transition : all 0.3s ease-in-out;
	max-height: calc(80%);
	overflow: auto;
`;

export const StyledToggleButton = styled(ToggleButton)`
	margin: 8px;
	align-self: center;
`;
export const StyledButton = styled(Button)`
	margin: 16px 0px;
	align-self: center;
	background: #02e296;
	&:disabled{
		background: #888;
		cursor: not-allowed;
	}
`;
export const StyledText = styled(Text)`
	border-bottom: 3px solid #02e296;
	width: calc(100% - 16px);
	padding: 8px;
`
export const Divider = styled.div`
	margin: 12px;
`

export const SectionTitle = styled(Text)`
	margin: 0px 4px 8px 0px;
`
