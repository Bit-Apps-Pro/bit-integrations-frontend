/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Loader from '../../Loaders/Loader'
import { getAllAccountList, getAllCampaignList, getAllContactList } from './SalesforceCommonFunc'
import { eventSubject, opportunityLeadSource, opportunityStage, opportunityType, caseStatus, caseOrigin, casePriority, potentialLiability, slaViolation } from './SalesforceDataStore'

export default function SalesforceActions({ salesforceConf, setSalesforceConf, formID, formFields, setSnackbar }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ) => {
    const newConf = { ...salesforceConf }
    if (val !== '') {
      newConf.actions[typ] = val
    } else {
      delete newConf.actions[typ]
    }
    setSalesforceConf({ ...newConf })
  }

  const openCampaignModel = () => {
    if (!salesforceConf?.default?.campaignLists) {
      getAllCampaignList(formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'campaign' })
  }
  const openAccountModel = () => {
    if (!salesforceConf?.default?.accountLists) {
      getAllAccountList(formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'account' })
  }

  const openContactModel = () => {
    if (!salesforceConf?.default?.contactLists) {
      getAllContactList(formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)
    }
    setActionMdl({ show: 'contact' })
  }

  const openActionMdl = (modelName) => {
    setActionMdl({ show: modelName })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">

        {salesforceConf.actionName === 'opportunity-create' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={openCampaignModel} checked={'campaignId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="campaignId" title={__('Campaign', 'bit-integrations')} subTitle={__('Campaign of salesforce.', 'bit-integrations')} />

          </div>
        )}
        { ['opportunity-create', 'event-create', 'case-create'].includes(salesforceConf.actionName) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={openAccountModel} checked={'accountId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="accountId" title={__('Account', 'bit-integrations')} subTitle={__('Account of salesforce.', 'bit-integrations')} />

          </div>
        )}
        {salesforceConf.actionName === 'opportunity-create' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={() => openActionMdl('opportunityStage')} checked={'opportunityStageId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="opportunityStageId" title={__('Opportunity Stage', 'bit-integrations')} subTitle={__('Opportunity stage of salesforce.', 'bit-integrations')} />
            <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>{__('This Required', 'bit-integrations')}</small>

          </div>
        )}
        {salesforceConf.actionName === 'opportunity-create' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={() => openActionMdl('opportunityType')} checked={'opportunityTypeId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="opportunityTypeId" title={__('Opportunity Type', 'bit-integrations')} subTitle={__('Opportunity type of salesforce.', 'bit-integrations')} />

          </div>
        )}
        {salesforceConf.actionName === 'opportunity-create' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={() => openActionMdl('opportunityLeadSource')} checked={'opportunityLeadSourceId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="opportunityLeadSourceId" title={__('Opportunity Lead Source', 'bit-integrations')} subTitle={__('Opportunity Lead Source of salesforce.', 'bit-integrations')} />
          </div>
        )}
        { ['event-create', 'case-create'].includes(salesforceConf.actionName) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={openContactModel} checked={'contactId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="contactId" title={__('Contacts', 'bit-integrations')} subTitle={__('Contacts of salesforce.', 'bit-integrations')} />
          </div>
        )}
        {salesforceConf.actionName === 'event-create' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={() => openActionMdl('eventSubject')} checked={'eventSubjectId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="eventSubjectId" title={__('Event Subject', 'bit-integrations')} subTitle={__('Event subject of salesforce.', 'bit-integrations')} />
            <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>{__('This Required', 'bit-integrations')}</small>
          </div>
        )}
        {salesforceConf.actionName === 'case-create' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={() => openActionMdl('caseStatus')} checked={'caseStatusId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="caseStatusId" title={__('Case Status', 'bit-integrations')} subTitle={__('Case Status of salesforce.', 'bit-integrations')} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={() => openActionMdl('caseOrigin')} checked={'caseOriginId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="caseOriginId" title={__('Case Origin', 'bit-integrations')} subTitle={__('Case Origin of salesforce.', 'bit-integrations')} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={() => openActionMdl('casePriority')} checked={'casePriorityId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="casePriorityId" title={__('Case Priority', 'bit-integrations')} subTitle={__('Case Priority of salesforce.', 'bit-integrations')} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={() => openActionMdl('potentialLiability')} checked={'potentialLiabilityId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="potentialLiabilityId" title={__('Potential Liability', 'bit-integrations')} subTitle={__('Potential Liability of salesforce.', 'bit-integrations')} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={() => openActionMdl('slaViolation')} checked={'slaViolationId' in salesforceConf.actions} className="wdt-200 mt-4 mr-2" value="slaViolationId" title={__('SLA Violation', 'bit-integrations')} subTitle={__('SLA ViolationId of salesforce.', 'bit-integrations')} />
            </div>
          </>
        )}
      </div>

      {/* campaign */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'campaign'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Campaign', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.campaignId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'campaignId')}
              >
                <option value="">{__('Select Campaign', 'bit-integrations')}</option>
                {salesforceConf?.default?.campaignLists && salesforceConf.default.campaignLists.map(item => <option key={item.Id} value={item.Id}>{item.Name}</option>)}
              </select>
              <button onClick={() => getAllCampaignList(formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Campaign"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      {/* account */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'account'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Account', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.accountId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'accountId')}
              >
                <option value="">{__('Select Account', 'bit-integrations')}</option>
                {salesforceConf?.default?.accountLists && salesforceConf.default.accountLists.map(item => <option key={item.Id} value={item.Id}>{item.Name}</option>)}
              </select>
              <button onClick={() => getAllAccountList(formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Account"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      {/* opportunity stage */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunityStage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunity Stage', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.opportunityStageId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'opportunityStageId')}
              >
                <option value="">{__('Select Opportunity Stage', 'bit-integrations')}</option>
                {opportunityStage.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* opportunity type */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunityType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunity Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.opportunityTypeId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'opportunityTypeId')}
              >
                <option value="">{__('Select Opportunity Type', 'bit-integrations')}</option>
                {opportunityType.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* opportunity Lead Source */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunityLeadSource'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunity Lead Source', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.opportunityLeadSourceId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'opportunityLeadSourceId')}
              >
                <option value="">{__('Select Opportunity Lead Source', 'bit-integrations')}</option>
                {opportunityLeadSource.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* contact */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'contact'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contact ', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.contactId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'contactId')}
              >
                <option value="">{__('Select Contact', 'bit-integrations')}</option>
                {salesforceConf?.default?.contactLists && salesforceConf.default.contactLists.map(item => <option key={item.Id} value={item.Id}>{item.Name}</option>)}
              </select>
              <button onClick={() => getAllContactList(formID, salesforceConf, setSalesforceConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Campaign"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      {/* event subject */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'eventSubject'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Event Subject', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.eventSubjectId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'eventSubjectId')}
              >
                <option value="">{__('Select event subject', 'bit-integrations')}</option>
                {eventSubject.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* case status */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'caseStatus'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Event Subject', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.caseStatusId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'caseStatusId')}
              >
                <option value="">{__('Select Case status', 'bit-integrations')}</option>
                {caseStatus.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* case origin */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'caseOrigin'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Event Subject', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.caseOriginId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'caseOriginId')}
              >
                <option value="">{__('Select Case Origin', 'bit-integrations')}</option>
                {caseOrigin.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* case priority */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'casePriority'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Case Priority', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.casePriorityId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'casePriorityId')}
              >
                <option value="">{__('Select Case Priority', 'bit-integrations')}</option>
                {casePriority.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* case potentialLiability */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'potentialLiability'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Potential liability', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.potentialLiabilityId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'potentialLiabilityId')}
              >
                <option value="">{__('Select Case potential liability', 'bit-integrations')}</option>
                {potentialLiability.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>

      {/* case slaViolation */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'slaViolation'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('SLA Violation', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
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
              <select
                value={salesforceConf.actions.slaViolationId}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'slaViolationId')}
              >
                <option value="">{__('Select Case SLA violation', 'bit-integrations')}</option>
                {potentialLiability.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          )}
      </ConfirmModal>
    </div>
  )
}
