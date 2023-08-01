/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import { getAllGroups } from './MailRelayCommonFunc'

export default function MailRelayActions({ mailRelayConf, setMailRelayConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...mailRelayConf }
    if (type === 'group') {
      if (e.target?.checked) {
        getAllGroups(mailRelayConf, setMailRelayConf, setLoading)
        newConf.actions.groups = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.groups
      }
      setActionMdl({ show: 'group' })
    }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    if (type === 'doubleOptIn') {
      if (e.target.checked) {
        newConf.actions.doubleOptIn = true
      } else {
        delete newConf.actions.doubleOptIn
      }
    }
    setMailRelayConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val) => {
    const newConf = { ...mailRelayConf }
    newConf.selectedGroups = val
    setMailRelayConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={mailRelayConf?.selectedGroups.length || false} onChange={(e) => actionHandler(e, 'group')} className="wdt-200 mt-4 mr-2" value="group" title={__('Add Groups', 'bit - integrations')} subTitle={__('Add Groups')} />
      <TableCheckBox checked={mailRelayConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="update_subscriber" title={__('Update subscriber', 'bit-integrations')} subTitle={__('Override the existing subscriber info by responses.', 'bit-integrations')} />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'group'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Groups', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select groups', 'bit-integrations')}
        </div>
        {
          loading.groups ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
            : (
              <div className="flx flx-between mt-2">
                <MultiSelect
                  options={mailRelayConf?.groups?.map(group => ({ label: group.name, value: group.id }))}
                  className="msl-wrp-options"
                  defaultValue={mailRelayConf?.selectedGroups}
                  onChange={val => setChanges(val)}
                />
                <button onClick={() => getAllGroups(mailRelayConf, setMailRelayConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Groups', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
    </div>
  )
}
