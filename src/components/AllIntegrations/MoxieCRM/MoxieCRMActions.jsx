/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import { getAllOpportunities, getAllOwners, getAllCompanies, getAllPipelineStages } from './MoxieCRMCommonFunc'

export default function MoxieCRMActions({ moxiecrmConf, setMoxieCRMConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const followUps = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]

  const opportunityTypes = [
    { label: 'New Business', value: 'New Business' },
    { label: 'Existing Business', value: 'Existing Business' },
  ]

  const actionHandler = (e, type) => {
    const newConf = { ...moxiecrmConf }

    if (type === 'opportunity') {
      if (e.target?.checked) {
        getAllOpportunities(moxiecrmConf, setMoxieCRMConf, setLoading)
        newConf.actions.opportunity = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.opportunity
      }
    } else if (type === 'owner') {
      if (e.target?.checked) {
        getAllOwners(moxiecrmConf, setMoxieCRMConf, setLoading)
        newConf.actions.owner = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.owner
      }
    } else if (type === 'company') {
      if (e.target?.checked) {
        getAllCompanies(moxiecrmConf, setMoxieCRMConf, setLoading)
        newConf.actions.company = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.company
      }
    } else if (type === 'pipelineStage') {
      if (e.target?.checked) {
        getAllPipelineStages(moxiecrmConf, setMoxieCRMConf, setLoading)
        newConf.actions.pipelineStage = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.pipelineStage
      }
    } else if (type === 'followUp') {
      if (e.target?.checked) {
        newConf.actions.followUp = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.followUp
      }
    } else if (type === 'opportunityType') {
      if (e.target?.checked) {
        newConf.actions.opportunityType = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.opportunityType
      }
    }

    setActionMdl({ show: type })
    setMoxieCRMConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...moxiecrmConf }
    newConf[name] = val
    setMoxieCRMConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {/* {(moxiecrmConf.actionName === 'person') && <TableCheckBox checked={moxiecrmConf?.selectedCompany?.length || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add an company')} />} */}
      {(moxiecrmConf.actionName === 'person' || moxiecrmConf.actionName === 'company' || moxiecrmConf.actionName === 'opportunity' || moxiecrmConf.actionName === 'task') && <TableCheckBox checked={moxiecrmConf?.selectedOwner?.length || false} onChange={(e) => actionHandler(e, 'owner')} className="wdt-200 mt-4 mr-2" value="owner" title={__('Add Owner', 'bit - integrations')} subTitle={__('Add an owner')} />}
      {(moxiecrmConf.actionName === 'opportunity') && <TableCheckBox checked={moxiecrmConf?.selectedCompany?.length || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add an company')} />}
      {(moxiecrmConf.actionName === 'opportunity') && <TableCheckBox checked={moxiecrmConf?.selectedPipelineStage?.length || false} onChange={(e) => actionHandler(e, 'pipelineStage')} className="wdt-200 mt-4 mr-2" value="pipelineStage" title={__('Add PipelineStage', 'bit - integrations')} subTitle={__('Add a pipelineStage')} />}
      {/* {(moxiecrmConf.actionName === 'task') && <TableCheckBox checked={moxiecrmConf?.selectedOpportunity?.length || false} onChange={(e) => actionHandler(e, 'opportunity')} className="wdt-200 mt-4 mr-2" value="opportunity" title={__('Add Opportunity', 'bit - integrations')} subTitle={__('Add a opportunity')} />} */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunity'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunities', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Opportunity', 'bit-integrations')}
        </div>
        {
          loading.opportunities ? (
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
                  options={moxiecrmConf?.opportunities?.map(opportunity => ({ label: opportunity.name, value: opportunity.id }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedOpportunity}
                  onChange={val => setChanges(val, 'selectedOpportunity')}
                  singleSelect
                />
                <button onClick={() => getAllOpportunities(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Opportunities', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Owners', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Owner', 'bit-integrations')}
        </div>
        {
          loading.owners ? (
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
                  options={moxiecrmConf?.owners?.map(owner => ({ label: owner.name, value: owner.id }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedOwner}
                  onChange={val => setChanges(val, 'selectedOwner')}
                  singleSelect
                />
                <button onClick={() => getAllOwners(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Owners', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Companies', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Company', 'bit-integrations')}
        </div>
        {
          loading.companies ? (
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
                  options={moxiecrmConf?.companies?.map(company => ({ label: company.name, value: company.id }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedCompany}
                  onChange={val => setChanges(val, 'selectedCompany')}
                  singleSelect
                />
                <button onClick={() => getAllCompanies(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Companies', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'pipelineStage'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('PipelineStages', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select PipelineStage', 'bit-integrations')}
        </div>
        {
          loading.pipelineStages ? (
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
                  options={moxiecrmConf?.pipelineStages?.map(pipelineStage => ({ label: pipelineStage.name, value: pipelineStage.id }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedPipelineStage}
                  onChange={val => setChanges(val, 'selectedPipelineStage')}
                  singleSelect
                />
                <button onClick={() => getAllPipelineStages(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh PipelineStages', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

      {/* <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Statuses', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Status', 'bit-integrations')}
        </div>
        {
          loading.statuses ? (
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
                  options={moxiecrmConf?.statuses?.map(status => ({ label: status.name, value: status.id }))}
                  className="msl-wrp-options"
                  defaultValue={moxiecrmConf?.selectedStatus}
                  onChange={val => setChanges(val, 'selectedStatus')}
                  singleSelect
                />
                <button onClick={() => getAllStatuses(moxiecrmConf, setMoxieCRMConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh statuses', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal> */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'followUp'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Follow Up', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={followUps?.map(followUp => ({ label: followUp.label, value: followUp.value }))}
            className="msl-wrp-options"
            defaultValue={moxiecrmConf?.selectedFollowUp}
            onChange={val => setChanges(val, 'selectedFollowUp')}
            singleSelect
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'opportunityType'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Opportunity types', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="flx flx-center mt-2">
          <MultiSelect
            options={opportunityTypes?.map(opportunityType => ({ label: opportunityType.label, value: opportunityType.value }))}
            className="msl-wrp-options"
            defaultValue={moxiecrmConf?.selectedOpportunityType}
            onChange={val => setChanges(val, 'selectedOpportunityType')}
            singleSelect
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
