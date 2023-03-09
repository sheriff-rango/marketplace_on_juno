import React, { useEffect, useState } from "react";
import { DisclaimerAgreementLocalStorageKey } from "../../constants/BasicTypes";
import Text from "../Text";
import {
    Divider,
    SectionTitle,
    StyledButton,
    StyledModal,
    StyledText,
    StyledToggleButton,
} from "./styled";

const Disclaimer: React.FC = () => {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(DisclaimerAgreementLocalStorageKey)) {
            setShowDisclaimer(false);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(DisclaimerAgreementLocalStorageKey, "1");
        setShowDisclaimer(false);
    };

    return (
        <>
            {showDisclaimer ? (
                <StyledModal
                    isOpen={showDisclaimer}
                    afterOpen={() => (document.body.style.overflow = "hidden")}
                    afterClose={() => (document.body.style.overflow = "unset")}
                >
                    <StyledText color="black" bold fontSize="2em">
                        Disclaimer
                    </StyledText>
                    <Divider></Divider>
                    <SectionTitle fontSize="1.1em" bold>
                        No Investment Advice
                    </SectionTitle>
                    <Text color="black">
                        The information provided on this website does not
                        constitute investment advice, financial advice, trading
                        advice, or any other sort of advice and you should not
                        treat any of the website's content as such. Hopers.io
                        does not recommend that any cryptocurrency should be
                        bought, sold, or held by you. Do conduct your own due
                        diligence and consult your financial advisor before
                        making any investment decisions.
                    </Text>
                    <Divider></Divider>
                    <SectionTitle fontSize="1.1em" bold>
                        Accuracy of Information
                    </SectionTitle>
                    <Text color="black">
                        Hopers.io will strive to ensure accuracy of information
                        listed on this website although it will not hold any
                        responsibility for any missing or wrong information.
                        Hopers.io provides all information as is. You understand
                        that you are using any and all information available
                        here at your own risk.
                    </Text>
                    <Divider></Divider>
                    <SectionTitle fontSize="1.1em" bold>
                        Non Endorsement
                    </SectionTitle>
                    <Text color="black">
                        The appearance of third party advertisements and
                        hyperlinks on Hopers.io does not constitute an
                        endorsement, guarantee, warranty, or recommendation by
                        Hopers.io. Do conduct your own due diligence before
                        deciding to use any third party services.
                    </Text>
                    <Divider></Divider>
                    <StyledToggleButton
                        label={{ title: "I agree" }}
                        onChange={(checked) => setAccepted(checked)}
                    ></StyledToggleButton>
                    <StyledButton
                        disabled={!accepted}
                        onClick={() => {
                            accept();
                        }}
                    >
                        Enter HOPERS
                    </StyledButton>
                </StyledModal>
            ) : null}
        </>
    );
};

export default Disclaimer;
