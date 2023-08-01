/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Loader from '../../Loaders/Loader'
import { refreshTags, refreshUsers } from './ZohoBiginCommonFunc'

export default function ZohoBiginActions({ tab, formID, formFields, biginConf, setBiginConf, setSnackbar }) {
  const [recOwnerMdl, setrecOwnerMdl] = useState(false)
  const [notesMdl, setNotesMdl] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const actionHandler = (val, typ, checked) => {
    const newConf = { ...biginConf }
    if (tab === 0) {
      if (checked !== undefined) {
        if (checked) newConf.actions[typ] = val
        else delete newConf.actions[typ]
      } else if (val) newConf.actions[typ] = val
      else delete newConf.actions[typ]
    } else if (checked !== undefined) {
      if (checked) newConf.relatedlists[tab - 1].actions[typ] = val
      else delete newConf.relatedlists[tab - 1].actions[typ]
    } else if (val) newConf.relatedlists[tab - 1].actions[typ] = val
    else delete newConf.relatedlists[tab - 1].actions[typ]

    setBiginConf({ ...newConf })
  }

  const module = tab === 0 ? biginConf.module : biginConf.relatedlists[tab - 1].module
  const getTags = () => {
    const arr = [
      { title: 'Tags', type: 'group', childs: [] },
      { title: 'Form Fields', type: 'group', childs: [] },
    ]

    if (biginConf?.default?.moduleData?.[module]?.tags) {
      arr[0].childs = Object.values(biginConf.default.moduleData[module].tags).map(tag => ({ label: tag.tagName, value: tag.tagId }))
    }

    arr[1].childs = formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))
    return arr
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const handleNoteAction = (typ, val) => {
    const newConf = { ...biginConf }
    if (!newConf.actions.note) newConf.actions.note = {}

    if (typ === 'field') {
      if (!newConf.actions.note.content) newConf.actions.note.content = ''
      newConf.actions.note.content += val
    } else if (val) newConf.actions.note[typ] = val
    else delete newConf.actions.note[typ]

    setBiginConf({ ...newConf })
  }

  return (
    <>
      <div className="d-flx flx-wrp">
        {biginConf?.relatedlists?.[tab - 1]?.module !== 'Notes'
          && (
            <>
              <TableCheckBox onChange={(e) => actionHandler(true, 'workflow', e.target.checked)} checked={tab === 0 ? 'workflow' in biginConf.actions : 'workflow' in biginConf.relatedlists?.[tab - 1]?.actions} className="wdt-200 mt-4 mr-2" value="Workflow" title={__('Workflow', 'bit-integrations')} subTitle={__('Trigger workflows in Zoho Bigin.', 'bit-integrations')} />
              <TableCheckBox onChange={(e) => actionHandler(true, 'approval', e.target.checked)} checked={tab === 0 ? 'approval' in biginConf.actions : 'approval' in biginConf.relatedlists?.[tab - 1]?.actions} className="wdt-200 mt-4 mr-2" value="Approval" title={__('Approval', 'bit-integrations')} subTitle={__('Send entries to approval list in Zoho Bigin.', 'bit-integrations')} />
              {(tab === 0 && !['Calls', 'Events', 'Tasks'].includes(biginConf.module)) && (
                <TableCheckBox onChange={() => setNotesMdl(true)} checked={'note' in biginConf.actions && ('title' in biginConf.actions?.note || 'content' in biginConf.actions?.note)} className="wdt-200 mt-4 mr-2" value="notes" title={__('Add a Note', 'bit-integrations')} subTitle={__('Add a note from bitform to pushed to Zoho Bigin.', 'bit-integrations')} />
              )}
            </>
          )}
        {/* <TableCheckBox onChange={() => setrecOwnerMdl(true)} checked={tab === 0 ? 'owner' in biginConf.actions : 'owner' in biginConf.relatedlists?.[tab - 1]?.actions} className="wdt-200 mt-4 mr-2" value="recordOwner"title={__('Record Owner', 'bit-integrations')} subTitle={__('Set owner of current record', 'bit-integrations')} /> */}
        {/* eslint-disable-next-line max-len */}
        {['Contacts', 'Accounts', 'Products'].includes(module) && <TableCheckBox onChange={() => setActionMdl({ show: 'photo' })} checked={tab === 0 ? 'photo' in biginConf.actions : 'photo' in biginConf.relatedlists[tab - 1].actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Upload Photo', 'bit-integrations')} subTitle={`Add a photo to ${module} in Zoho Bigin.`} />}
        <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={tab === 0 ? 'attachments' in biginConf.actions : 'attachments' in biginConf.relatedlists[tab - 1].actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Attachment', 'bit-integrations')} subTitle={__('Add attachments from BitForm to Zoho Bigin.', 'bit-integrations')} />
        {/* <TableCheckBox onChange={() => setActionMdl({ show: 'tag_rec' })} checked={tab === 0 ? 'tag_rec' in biginConf.actions : 'tag_rec' in biginConf.relatedlists[tab - 1].actions} className="wdt-200 mt-4 mr-2" value="Tag_Records"title={__('Tag Records', 'bit-integrations')} subTitle={__('Add a tag to records pushed to Zoho Bigin.', 'bit-integrations')} /> */}
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'attachments'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Select Attachment', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Select file upload fields', 'bit-integrations')}</div>
        <MultiSelect
          defaultValue={tab === 0 ? biginConf.actions.attachments : biginConf.relatedlists[tab - 1].actions.attachments}
          className="mt-2 w-9"
          onChange={(val) => actionHandler(val, 'attachments')}
          options={formFields.filter(itm => (itm.type === 'file')).map(itm => ({ label: itm.label, value: itm.name }))}
        />
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'photo'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Upload Photo', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Select file upload fields', 'bit-integrations')}</div>
        <MultiSelect
          defaultValue={tab === 0 ? biginConf.actions.photo : biginConf.relatedlists[tab - 1].actions.photo}
          className="mt-2 w-9"
          onChange={(val) => actionHandler(val, 'photo')}
          options={formFields.filter(itm => (itm.type === 'file')).map(itm => ({ label: itm.label, value: itm.name }))}
          singleSelect
        />
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={recOwnerMdl}
        close={() => setrecOwnerMdl(false)}
        action={() => setrecOwnerMdl(false)}
        title={__('Record Owner', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={tab === 0 ? biginConf.actions.owner : biginConf.relatedlists[tab - 1].actions.owner}
                options={biginConf.default?.users && Object.values(biginConf.default.users).map(user => ({ label: user.userName, value: user.userId }))}
                onChange={(val) => actionHandler(val, 'owner')}
                customValue
              />
              <button onClick={() => refreshUsers(formID, biginConf, setBiginConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Users"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'tag_rec'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <small>
          {`Add a tag to ${module} pushed to Zoho Bigin`}
        </small>
        <div className="mt-2">{__('Tag Name', 'bit-integrations')}</div>
        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={tab === 0 ? biginConf.actions.tag_rec : biginConf.relatedlists[tab - 1].actions.tag_rec}
                options={getTags()}
                onChange={(val) => actionHandler(val, 'tag_rec')}
              />
              <button onClick={() => refreshTags(tab, formID, biginConf, setBiginConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh CRM Tags"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}
      </ConfirmModal>

      {tab === 0
        && (
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="blue"
            btnTxt="Ok"
            show={notesMdl}
            close={() => setNotesMdl(false)}
            action={() => setNotesMdl(false)}
            title={__('Notes', 'bit-integrations')}
          >
            <div className="btcd-hr mt-2 mb-2" />
            {isLoading
              ? (
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
                <>
                  <div className="mt-2 mb-1">{__('Note Title', 'bit-integrations')}</div>
                  <input type="text" className="btcd-paper-inp" placeholder={__('Note Title', 'bit-integrations')} onChange={e => handleNoteAction('title', e.target.value)} value={tab === 0 ? (biginConf.actions?.note?.title || '') : (biginConf.relatedlists[tab - 1].actions?.note?.title || '')} />
                  <div className="mt-2 mb-1">{__('Note Content', 'bit-integrations')}</div>
                  <select className="btcd-paper-inp w-5" onChange={e => handleNoteAction('field', e.target.value)}>
                    <option value="">{__('Field', 'bit-integrations')}</option>
                    {formFields.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f.name}`} value={`\${${f.name}}`}>{f.label}</option>)}
                  </select>
                  <textarea rows="5" className="btcd-paper-inp mt-2" onChange={e => handleNoteAction('content', e.target.value)} value={tab === 0 ? (biginConf.actions?.note?.content || '') : (biginConf.relatedlists[tab - 1].actions?.note?.content || '')} />
                </>
              )}
          </ConfirmModal>
        )}
    </>
  )
}
