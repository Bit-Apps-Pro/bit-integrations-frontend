/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, vboutConf, setVboutConf) => {
  const newConf = { ...vboutConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setVboutConf({ ...newConf })
}



export const generateMappedField = (vboutConf) => {
  const requiredFlds = vboutConf?.VboutFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', VboutFormField: field.key })) : [{ formField: '', VboutFormField: '' }]
}

export const checkMappedFields = (vboutConf) => {
  const mappedFields = vboutConf?.field_map ? vboutConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.VboutFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const handleAuthorize = (confTmp, setConf, setError, setisAuthorized,loading, setLoading) => {
  if (!confTmp.auth_token) {
    setError({ auth_token: !confTmp.auth_token ? __('Api Key can\'t be empty', 'bit-integrations') : '' })
    return
  }
  setError({})
  setLoading({ ...loading, auth: true })


  const requestParams = { auth_token: confTmp.auth_token }
  bitsFetch(requestParams, 'vbout_handle_authorize')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        setConf(newConf)
        setisAuthorized(true)
        setLoading({ ...loading, auth: false })
        toast.success(__('Authorized successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, auth: false })
      toast.error(__('Authorized failed', 'bit-integrations'))
    })
}


export const VboutRefreshFields = (confTmp, setConf,loading, setLoading) => {
  setLoading({ ...loading, field: true })

  const requestParams = { auth_token: confTmp.auth_token, list_id: confTmp.list_id }

  bitsFetch(requestParams, 'vbout_refresh_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.VboutFields = result.data
        }
        setConf(newConf)
        setLoading({ ...loading, field: false })
        toast.success(__('Fields refresh successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, field: false })
      toast.error(__('Fields refresh failed', 'bit-integrations'))
    })
}

export const getAllLists = (confTmp, setConf,loading, setLoading,) => {
  setLoading({ ...loading, list: true })

  const requestParams = { auth_token: confTmp.auth_token }

  bitsFetch(requestParams, 'vbout_fetch_all_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          if (!newConf.default) {
            newConf.default = {}
          }
          newConf.default.lists = result.data
        }
        setConf(newConf)
        setLoading({ ...loading, list: false })

        toast.success(__('List refresh successfully', 'bit-integrations'))
        return
      }
      setLoading({ ...loading, list: false })
      toast.error(__('List refresh failed', 'bit-integrations'))
    })

}
