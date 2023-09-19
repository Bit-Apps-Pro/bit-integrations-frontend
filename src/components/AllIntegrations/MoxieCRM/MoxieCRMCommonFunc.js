/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, moxiecrmConf, setMoxieCRMConf) => {
  const newConf = { ...moxiecrmConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setMoxieCRMConf({ ...newConf });
};

export const generateMappedField = (moxiecrmConf) => {
  let allRequiredFields = [];
  if (moxiecrmConf.actionName === "company") {
    allRequiredFields = moxiecrmConf?.companyFields;
  } else if (moxiecrmConf.actionName === "person") {
    allRequiredFields = moxiecrmConf?.personFields;
  } else if (moxiecrmConf.actionName === "opportunity") {
    allRequiredFields = moxiecrmConf?.opportunityFields;
  } else if (moxiecrmConf.actionName === "task") {
    allRequiredFields = moxiecrmConf?.taskFields;
  }
  const requiredFlds = allRequiredFields?.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        moxiecrmFormField: field.key,
      }))
    : [{ formField: "", moxiecrmFormField: "" }];
};

export const checkMappedFields = (moxiecrmConf) => {
  const mappedFields = moxiecrmConf?.field_map
    ? moxiecrmConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.moxiecrmFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.moxiecrmFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const moxiecrmAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_url || !confTmp.api_key) {
    setError({
      api_url: !confTmp.api_url
        ? __("API Url can't be empty", "bit-integrations")
        : "",
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
    api_url: confTmp.api_url,
  };

  bitsFetch(requestParams, "moxiecrm_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __(
        "Authorized failed, Please enter valid api_url name & API key",
        "bit-integrations"
      )
    );
  });
};

export const getCustomFields = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, customFields: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
    action: confTmp.actionName,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_custom_fields").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.customFields = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, customFields: false });
      if (!result.data) {
        toast.error(__("No custom fields found", "bit-integrations"));
      } else {
        toast.success(
          __("Custom fields also fetched successfully", "bit-integrations")
        );
      }
      return;
    }
    setLoading({ ...setLoading, customFields: false });
    toast.error(__("Custom fields fetching failed", "bit-integrations"));
  });
};

export const getAllOpportunities = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, opportunities: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_all_opportunities").then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...confTmp };
        if (result.data) {
          newConf.opportunities = result.data;
        }
        setConf(newConf);
        setLoading({ ...setLoading, opportunities: false });

        toast.success(
          __("Opportunities fetched successfully", "bit-integrations")
        );
        return;
      }
      setLoading({ ...setLoading, opportunities: false });
      toast.error(__("Opportunities fetching failed", "bit-integrations"));
    }
  );
};

export const getAllOwners = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, owners: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_all_owners").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.owners = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, owners: false });

      toast.success(__("Owners fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, owners: false });
    toast.error(__("Owners fetching failed", "bit-integrations"));
  });
};

export const getAllCompanies = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, companies: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_all_companies").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.companies = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, companies: false });

      toast.success(__("Companies fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, companies: false });
    toast.error(__("Companies fetching failed", "bit-integrations"));
  });
};

export const getAllPipelineStages = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, pipelineStages: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
    action_name: confTmp.actionName,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_all_pipelineStages").then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...confTmp };
        if (result.data) {
          newConf.pipelineStages = result.data;
        }
        setConf(newConf);
        setLoading({ ...setLoading, pipelineStages: false });

        toast.success(
          __("PipelineStages fetched successfully", "bit-integrations")
        );
        return;
      }
      setLoading({ ...setLoading, pipelineStages: false });
      toast.error(__("PipelineStages fetching failed", "bit-integrations"));
    }
  );
};

export const getAllCRMPeoples = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, CRMPeoples: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
    action_name: confTmp.actionName,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_all_CRMPeoples").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.CRMPeoples = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, CRMPeoples: false });

      toast.success(__("Peoples fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, CRMPeoples: false });
    toast.error(__("Peoples fetching failed", "bit-integrations"));
  });
};

export const getAllCRMPipelines = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, CRMPipelines: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_url: confTmp.api_url,
  };

  bitsFetch(requestParams, "moxiecrm_fetch_all_CRMPipelines").then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...confTmp };
        if (result.data) {
          newConf.CRMPipelines = result.data;
        }
        setConf(newConf);
        setLoading({ ...setLoading, CRMPipelines: false });

        toast.success(__("Pipelines fetched successfully", "bit-integrations"));
        return;
      }
      setLoading({ ...setLoading, CRMPipelines: false });
      toast.error(__("Pipelines fetching failed", "bit-integrations"));
    }
  );
};
