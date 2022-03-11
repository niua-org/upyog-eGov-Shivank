import React, { useEffect, useState } from "react";
import { CitizenInfoLabel, Loader, Dropdown, FormStep, CardLabel, RadioOrSelect } from "@egovernments/digit-ui-react-components";

const SelectPropertyType = ({ config, onSelect, t, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const select = (items) => items.map((item) => ({ ...item, i18nKey: t(item.i18nKey) }));

  const propertyTypesData = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PropertyType", { select });

  const [propertyType, setPropertyType] = useState();

  useEffect(() => {
    if (!propertyTypesData.isLoading && propertyTypesData.data) {
      const preFilledPropertyType = propertyTypesData.data.filter(
        (propertyType) => propertyType.code === (formData?.propertyType?.code || formData?.propertyType)
      )[0];
      setPropertyType(preFilledPropertyType);
    }
  }, [formData?.propertyType, propertyTypesData.data]);

  const goNext = () => {
    onSelect(config.key, propertyType);
  };
  function selectedValue(value) {
    setPropertyType(value);
  }
  function selectedType(value) {
    onSelect(config.key, value.code);
  }

  if (propertyTypesData.isLoading) {
    return <Loader />;
  }
  if (userType === "employee") {
    return <Dropdown option={propertyTypesData.data} optionKey="i18nKey" id="propertyType" selected={propertyType} select={selectedType} t={t} />;
  } else {
    return (
      <React.Fragment>
        <FormStep config={config} onSelect={goNext} isDisabled={!propertyType} t={t}>
          <CardLabel>{`${t("CS_FILE_APPLICATION_PROPERTY_LABEL")} *`}</CardLabel>
          <RadioOrSelect options={propertyTypesData.data} selectedOption={propertyType} optionKey="i18nKey" onSelect={selectedValue} t={t} />
        </FormStep>
        {propertyType && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_FILE_APPLICATION_INFO_TEXT", propertyType)} />}
        {formData && formData.selectPaymentPreference && formData.selectPaymentPreference.code === 'PRE_PAY' && <CitizenInfoLabel style={{ marginTop: "8px" }} info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_PAY_NOW", formData)} />}
        {formData && formData.selectPaymentPreference && formData.selectPaymentPreference.code === 'POST_PAY' && <CitizenInfoLabel style={{ marginTop: "8px" }} info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_PAY_LATER", formData)} />}
      </React.Fragment>
    );
  }
};

export default SelectPropertyType;
