/* eslint-disable no-unused-expressions */
import toast from 'react-hot-toast'
import { resetRecoil } from 'recoil-nexus'
import { $actionConf, $flowStep, $newFlow } from '../../../GlobalStates'
import { webhookIntegrations } from '../../../Utils/StaticData/webhookIntegrations'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { EDDStateIH, GamiPressStateIH, GiveWpStateIH, LifterLmsStateIH, MasterStudyLmsStateIH, PaidMembershipProStateIH, RestrictContentStateIH, SliceWpStateIH, SureCartStateIH, ThriveApprenticeStateIH, UltimateMemberStateIH, affiliateStateIH, buddybossStateIH, fluentCrmStateIH, groundhoggStateIH, jetEngineStateIH, learndashStateIH, memberpressStateIH, postStateIH, tutorlmsStateIH, wooCommerceStateIH, wpCoursewareStateIH } from '../../Triggers/TriggerHelpers/TriggerStateHelper'

export const checkWebhookIntegrationsExist = (entity) => {
  const integrations = webhookIntegrations
  return integrations.includes(entity)
}

export const saveIntegConfig = async (flow, setFlow, allIntegURL, confTmp, navigate, index, edit, setIsLoading) => {
  let action = 'flow/save'
  setIsLoading(true)
  let tmpConf = confTmp
  if (confTmp?.condition?.action_behavior !== 'cond') {
    tmpConf.condition = {
      action_behavior: '',
      actions: [{ field: '', action: 'value' }],
      logics: [
        { field: '', logic: '', val: '' },
        'or',
        { field: '', logic: '', val: '' },
      ],
    }
  }

  /**
   * TODO
   *
   * This is a temporary fix
   * Have to move this to a better place
   */
  if (flow.triggered_entity === 'Elementor' || flow.triggered_entity === 'Divi' || flow.triggered_entity === 'Bricks' || flow.triggered_entity === 'Brizy' || flow.triggered_entity === 'Breakdance' || flow.triggered_entity === 'CartFlow') {
    if (edit) {
      tmpConf.postId = flow?.flow_details?.postId ?? null
    } else {
      tmpConf.postId = flow?.triggerData?.postId ?? null
    }
  } else if (flow.triggered_entity === 'TutorLms') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = tutorlmsStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'WC') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = wooCommerceStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Groundhogg') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = groundhoggStateIH(tmpConf, dataFlow, flow.triggered_entity_id)
  } else if (flow.triggered_entity === 'RestrictContent') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = RestrictContentStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'LearnDash') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = learndashStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'GamiPress') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = GamiPressStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Affiliate') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = affiliateStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'BuddyBoss') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = buddybossStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'WPCourseware') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = wpCoursewareStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'FluentCrm') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = fluentCrmStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Post') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = postStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'JetEngine') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = jetEngineStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Memberpress') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = memberpressStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'PaidMembershipPro') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = PaidMembershipProStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'SliceWp') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = SliceWpStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'SureCart') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = SureCartStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'GiveWp') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = GiveWpStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'LifterLms') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = LifterLmsStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'MasterStudyLms') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = MasterStudyLmsStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'ThriveApprentice') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = ThriveApprenticeStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'EDD') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = EDDStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'UltimateMember') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = UltimateMemberStateIH(tmpConf, dataFlow)
  }
  // else if (flow.triggered_entity === 'CaptureAction') {
  //   if (flow?.triggerData?.formID) {
  //     flow.triggerData.formID = `btcbi_capture_action_${flow.triggerData.formID}`
  //   } else {
  //     flow.triggered_entity_id = `btcbi_capture_action_${flow.triggered_entity_id}`
  //   }
  // }

  const data = {
    name: confTmp.name,
    trigger: flow.triggered_entity,
    triggered_entity_id: flow?.triggerData?.formID ? flow.triggerData.formID : (flow.triggered_entity_id || 0),
    flow_details: tmpConf,
  }
  if (flow.id) {
    data.id = flow.id
  }

  if (checkWebhookIntegrationsExist(flow.triggered_entity)) {
    data.flow_details.fields = !edit ? flow?.triggerDetail?.data : flow?.flow_details?.fields
  }
  if (edit) {
    action = 'flow/update'
  }
  try {
    const res = await bitsFetch(data, action)
    if (!edit && res.success) {
      navigate(allIntegURL)
      // getRecoil, setRecoil, resetRecoil
      resetRecoil($newFlow)
      resetRecoil($flowStep)
      resetRecoil($actionConf)
    }
    setIsLoading(false)
    return res
  } catch (e) {
    setIsLoading(false)
    return __('Failed to save integration', 'bit-integrations')
  }
}

export const saveActionConf = async ({ flow, setFlow, allIntegURL, conf, navigate, index, edit, setIsLoading, setSnackbar }) => {
  let action = 'flow/save'
  setIsLoading && setIsLoading instanceof Function && setIsLoading(true)
  let tmpConf = conf

  /**
   * TODO
   *
   * This is a temporary fix
   * Have to move this to a better place
   */
  if (flow.triggered_entity === 'Elementor' || flow.triggered_entity === 'Divi' || flow.triggered_entity === 'Bricks' || flow.triggered_entity === 'Brizy' || flow.triggered_entity === 'Breakdance' || flow.triggered_entity === 'CartFlow') {
    if (edit) {
      tmpConf.postId = flow?.flow_details?.postId ?? null
    } else {
      tmpConf.postId = flow?.triggerData?.postId ?? null
    }
  } else if (flow.triggered_entity === 'TutorLms') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = tutorlmsStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'WC') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = wooCommerceStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Groundhogg') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = groundhoggStateIH(tmpConf, dataFlow, flow.triggered_entity_id)
  } else if (flow.triggered_entity === 'RestrictContent') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = RestrictContentStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'LearnDash') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = learndashStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'BuddyBoss') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = buddybossStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'WPCourseware') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = wpCoursewareStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'FluentCrm') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = fluentCrmStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Post') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = postStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'JetEngine') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = jetEngineStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Affiliate') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = affiliateStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'Memberpress') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = memberpressStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'PaidMembershipPro') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = PaidMembershipProStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'SliceWp') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = SliceWpStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'SureCart') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = SureCartStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'GiveWp') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = GiveWpStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'LifterLms') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = LifterLmsStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'EDD') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = EDDStateIH(tmpConf, dataFlow)
  } else if (flow.triggered_entity === 'UltimateMember') {
    const dataFlow = edit ? flow?.flow_details : flow?.triggerData
    tmpConf = UltimateMemberStateIH(tmpConf, dataFlow)
  }

  const data = {
    name: conf.name,
    trigger: flow.triggered_entity,
    triggered_entity_id: flow?.triggerData?.formID ? flow.triggerData.formID : (flow.triggered_entity_id || 0),
    flow_details: tmpConf,
  }
  if (flow.id) {
    data.id = flow.id
  }
  if (checkWebhookIntegrationsExist(flow.triggered_entity)) {
    data.flow_details.fields = !edit ? flow?.triggerDetail?.data : flow?.flow_details?.fields
  }
  if (edit) {
    action = 'flow/update'
  }
  try {
    await bitsFetch(data, action)
      .then(res => {
        if (!edit && res.success) {
          navigate(allIntegURL)
        }

        let msg = ''
        let msgType = 'success'
        if (res.data?.msg) {
          msg = res.data.msg
        } else if (res.success) {
          msg = edit ? __('Integration updated successfully', 'bit-integrations') : __('Integration saved successfully', 'bit-integrations')
        } else {
          msgType = 'error'
          msg = edit ? __('Failed to update integration', 'bit-integrations') : __('Failed to save integration', 'bit-integrations')
        }
        toast(msg, { type: msgType })

        setIsLoading && setIsLoading instanceof Function && setIsLoading(false)
        if (!edit) {
          setTimeout(() => {
            navigate(allIntegURL)
          }, 700)
        }
      })
  } catch (e) {
    setIsLoading && setIsLoading instanceof Function && setIsLoading(false)
    return __('Failed to save integration', 'bit-integrations')
  }
}

export const setGrantTokenResponse = (integ) => {
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
  localStorage.setItem(`__${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleAuthorize = (integ, ajaxInteg, scopes, confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar, btcbi) => {
  if (!confTmp.dataCenter || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      dataCenter: !confTmp.dataCenter ? __('Data center cann\'t be empty', 'bit-integrations') : '',
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty', 'bit-integrations') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty', 'bit-integrations') : '',
    })
    return
  }
  setIsLoading(true)
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}`)}/redirect`
  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem(`__${integ}`)
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem(`__${integ}`)
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed', 'bit-integrations')} ${errorCause}. ${__('please try again', 'bit-integrations')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(ajaxInteg, grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar, btcbi)
      }
    }
  }, 500)
}

const tokenHelper = (ajaxInteg, grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar, btcbi) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.dataCenter = confTmp.dataCenter
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  // tokenRequestParams.redirectURI = `${encodeURIComponent(window.location.href)}/redirect`
  tokenRequestParams.redirectURI = `${btcbi.api.base}/redirect`

  bitsFetch(tokenRequestParams, `${ajaxInteg}_generate_token`)
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

export const addFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    uploadFields ? newConf.relatedlists[tab - 1].upload_field_map.splice(i, 0, {}) : newConf.relatedlists[tab - 1].field_map.splice(i, 0, {})
  } else {
    uploadFields ? newConf.upload_field_map.splice(i, 0, {}) : newConf.field_map.splice(i, 0, {})
  }

  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    if (uploadFields) {
      if (newConf.relatedlists[tab - 1].upload_field_map.length > 1) {
        newConf.relatedlists[tab - 1].upload_field_map.splice(i, 1)
      }
    } else if (newConf.relatedlists[tab - 1].field_map.length > 1) {
      newConf.relatedlists[tab - 1].field_map.splice(i, 1)
    }
  } else if (uploadFields) {
    if (newConf.upload_field_map.length > 1) {
      newConf.upload_field_map.splice(i, 1)
    }
  } else if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, uploadFields, tab) => {
  const newConf = { ...conftTmp }

  if (tab) {
    if (uploadFields) newConf.relatedlists[tab - 1].upload_field_map[index][event.target.name] = event.target.value
    else newConf.relatedlists[tab - 1].field_map[index][event.target.name] = event.target.value
  } else if (uploadFields) newConf.upload_field_map[index][event.target.name] = event.target.value
  else newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    if (tab) {
      newConf.relatedlists[tab - 1].field_map[index].customValue = ''
    } else newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    newConf.relatedlists[tab - 1].field_map[index].customValue = event.target.value
  } else {
    newConf.field_map[index].customValue = event
  }
  setConf({ ...newConf })
}
