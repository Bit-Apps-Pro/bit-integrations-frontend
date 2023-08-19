/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";
import { create } from "mutative";

export const handleInput = (e, salesflareConf, setSalesflareConf) => {
  const newConf = { ...salesflareConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setSalesflareConf({ ...newConf });
};

export const generateMappedField = (salesflareConf) => {
  const requiredFlds =
    salesflareConf?.salesflareFields &&
    salesflareConf?.salesflareFields.filter(
      (fld) =>
        fld.required === true && fld.key !== "owner" && fld.key !== "pipeline"
    );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        salesflareFormField: field.key,
      }))
    : [{ formField: "", salesflareFormField: "" }];
};

export const checkMappedFields = (salesflareConf) => {
  const mappedFields = salesflareConf?.field_map
    ? salesflareConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.salesflareFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.salesflareFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const salesflareAuthentication = (
  confTmp,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key
        ? __("Api Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = {
    api_key: confTmp.api_key,
  };

  bitsFetch(requestParams, "salesflare_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __("Authorized failed, Please enter valid API Key", "bit-integrations")
    );
  });
};

export const salesflareFields = (
  salesflareConf,
  setSalesflareConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: salesflareConf.api_key,
    action_name: salesflareConf.actionName,
  };

  bitsFetch(requestParams, "Salesflare_custom_fields")
    .then((result) => {
      if (result && result.success) {
        setSalesflareConf((prevConf) => {
          const draftConf = prevConf;
          draftConf.field_map = [{ formField: "", salesmateFormField: "" }];
          if (result.data) {
            draftConf.salesflareFields = [
              ...draftConf.salesflareFields,
              ...result.data,
            ];
          }
          draftConf.field_map = generateMappedField(draftConf);
          return draftConf;
        });
        setSnackbar({
          show: true,
          msg: __("Salesflare custom fields refreshed", "bit-integrations"),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __("Salesflare custom fields not found.", "bit-integrations"),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};
