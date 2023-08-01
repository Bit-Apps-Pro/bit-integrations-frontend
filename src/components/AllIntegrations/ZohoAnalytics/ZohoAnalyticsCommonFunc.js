import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { checkValidEmail } from '../../../Utils/Helpers'

export const setGrantTokenResponse = () => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}/redirect`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem('__zohoAnalytics', JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.dataCenter || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      dataCenter: !confTmp.dataCenter ? __('Data center cann\'t be empty', 'bit-integrations') : '',
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  if (!checkValidEmail(confTmp.ownerEmail)) {
    setError({ ownerEmail: !checkValidEmail(confTmp.ownerEmail) ? __('Email is invalid', 'bit-integrations') : '' })
    return
  }
  setIsLoading(true)
  const scopes = 'ZohoAnalytics.metadata.read,ZohoAnalytics.data.read,ZohoAnalytics.data.create,ZohoAnalytics.data.update,ZohoAnalytics.usermanagement.read,ZohoAnalytics.share.create'
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&redirect_uri=${encodeURIComponent(window.location.href)}/redirect`
  const authWindow = window.open(apiEndpoint, 'zohoAnalytics', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem('__zohoAnalytics')
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem('__zohoAnalytics')
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.dataCenter = confTmp.dataCenter
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = `${encodeURIComponent(window.location.href)}/redirect`
  bitsFetch(tokenRequestParams, 'zanalytics_generate_token')
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully', 'bit-integrations') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Authorization failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
}

export const handleInput = (e, analyticsConf, setAnalyticsConf, formID, setIsLoading, setSnackbar) => {
  let newConf = { ...analyticsConf }
  const { name, value } = e.target
  newConf[name] = value

  switch (name) {
    case 'workspace':
      newConf = workspaceChange(newConf, formID, setAnalyticsConf, setIsLoading, setSnackbar)
      break
    case 'table':
      newConf = tableChange(newConf, formID, setAnalyticsConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setAnalyticsConf({ ...newConf })
}

export const workspaceChange = (analyticsConf, formID, setAnalyticsConf, setIsLoading, setSnackbar) => {
  const newConf = { ...analyticsConf }
  newConf.table = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]

  if (!newConf?.default?.tables?.[analyticsConf.workspace]) {
    refreshTables(formID, newConf, setAnalyticsConf, setIsLoading, setSnackbar)
  } else if (Object.keys(newConf?.default?.tables?.[analyticsConf.workspace]).length === 1) {
    newConf.table = newConf?.default?.tables?.[analyticsConf.workspace][0].viewName

    if (!newConf?.default?.tables?.headers?.[newConf.table]) {
      refreshTableHeaders(formID, newConf, setAnalyticsConf, setIsLoading, setSnackbar)
    }
  }

  if (!analyticsConf.default.users) {
    refreshUsers(formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar)
  }

  return newConf
}

export const tableChange = (analyticsConf, formID, setAnalyticsConf, setIsLoading, setSnackbar) => {
  const newConf = { ...analyticsConf }
  newConf.field_map = [{ formField: '', zohoFormField: '' }]

  if (!newConf?.default?.tables?.headers?.[analyticsConf.table]) {
    refreshTableHeaders(formID, newConf, setAnalyticsConf, setIsLoading, setSnackbar)
  }

  return newConf
}

export const refreshWorkspaces = (formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: analyticsConf.id,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshModulesRequestParams, 'zanalytics_refresh_workspaces')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.workspaces) {
          newConf.default.workspaces = result.data.workspaces
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Workspaces refreshed', 'bit-integrations') })
        setAnalyticsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Workspaces refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Workspaces refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshUsers = (formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const refreshUsersRequestParams = {
    formID,
    id: analyticsConf.id,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshUsersRequestParams, 'zanalytics_refresh_users')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.users) {
          newConf.default.users = result.data.users
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Users refreshed', 'bit-integrations') })
        setAnalyticsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Users refresh failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}` })
      } else {
        setSnackbar({ show: true, msg: __('Users refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshTables = (formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar) => {
  const { workspace } = analyticsConf
  if (!workspace) {
    return
  }

  setIsLoading(true)
  const refreshTablesRequestParams = {
    formID,
    workspace,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshTablesRequestParams, 'zanalytics_refresh_tables')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (result.data.tables) {
          if (!newConf.default.tables) {
            newConf.default.tables = {}
          }
          newConf.default.tables[workspace] = result.data.tables
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Tables refreshed', 'bit-integrations') })
        setAnalyticsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Tables refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshTableHeaders = (formID, analyticsConf, setAnalyticsConf, setIsLoading, setSnackbar) => {
  const { workspace, table } = analyticsConf
  if (!table) {
    return
  }

  setIsLoading(true)
  const refreshTableHeadersRequestParams = {
    formID,
    workspace,
    table,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshTableHeadersRequestParams, 'zanalytics_refresh_table_headers')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (result.data.table_headers) {
          if (!newConf.default.tables.headers) {
            newConf.default.tables.headers = {}
          }
          newConf.default.tables.headers[table] = result.data.table_headers
          setSnackbar({ show: true, msg: __('Table Headers refreshed', 'bit-integrations') })
        } else {
          setSnackbar({ show: true, msg: __("Zoho didn't provide column names for this table", 'bit-integrations') })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setAnalyticsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Table Headers refresh failed. please try again', 'bit-integrations') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}
