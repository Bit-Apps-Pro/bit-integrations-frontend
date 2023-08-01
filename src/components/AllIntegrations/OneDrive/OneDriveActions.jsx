/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Loader from '../../Loaders/Loader'
import Modal from '../../Utilities/Modal'
import ConfirmModal from '../../Utilities/ConfirmModal'

export default function OneDriveActions({ oneDriveConf, setOneDriveConf, formFields, formID, setSnackbar }) {
  const folder = oneDriveConf.folderMap ? oneDriveConf.folderMap[0] : oneDriveConf.folder
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ, share) => {
    const newConf = { ...oneDriveConf }
    if (typ === 'create_folder') {
      if (val.target.checked) {
        newConf.actions.create_folder = { name: '', suffix: false }
      } else {
        delete newConf.actions.create_folder
        delete newConf.actions.share.folder
      }
    } else if (typ === 'attachments') {
      if (val !== '') {
        newConf.actions.attachments = val
      } else {
        delete newConf.actions.attachments
        delete newConf.actions.share.file
      }
    }

    setOneDriveConf({ ...newConf })
  }

  const actionDeleteHandler = (e, type) => {
    const newConf = { ...oneDriveConf }
    if (type === 'deleteFile') {
      if (e.target.checked) {
        newConf.actions.delete_from_wp = true
      } else {
        delete newConf.actions.delete_from_wp
      }
    }
    setOneDriveConf({ ...newConf })
  }

  const handleShareSetting = (i, act, val, typ) => {
    const newConf = { ...oneDriveConf }

    newConf.actions.share[typ].permissions[i][act] = val

    setOneDriveConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const openUploadFileMdl = () => {
    if (!oneDriveConf.actions?.share) oneDriveConf.actions.share = {}

    if (!oneDriveConf.actions?.share?.file) {
      oneDriveConf.actions.share.file = {
        permissions: [
          { email: '', access: '34', accessLabel: 'View' },
          { email: '', access: '5', accessLabel: 'Edit' },
          { email: '', access: '4', accessLabel: 'Share' },
          { email: '', access: '6', accessLabel: 'View and Comment' },
        ],
        mail: 'false',
      }
    }

    setActionMdl({ show: 'attachments' })
  }

  const getFileUpFields = () => formFields.filter(itm => (itm.type === 'file')).map(itm => ({ label: itm.label, value: itm.name }))

  // useEffect(() => {
  //   const usersOption = [
  //     { title: 'Zoho Workdrive Users', type: 'group', childs: [] },
  //     { title: 'Form Fields', type: 'group', childs: [] },
  //   ]
  //   if (oneDriveConf.team && !oneDriveConf.default?.users?.[oneDriveConf.team]) {
  //     refreshUsers(formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar)
  //   }

  //   if (oneDriveConf.default?.users?.[oneDriveConf.team]) {
  //     usersOption[0].childs[0] = { label: 'All Users', value: 'all_users' }
  //     const teamUsers = Object.values(oneDriveConf.default.users[oneDriveConf.team])

  //     for (let i = 0; i < teamUsers.length; i += 1) {
  //       usersOption[0].childs[i + 1] = { label: teamUsers[i].userName, value: teamUsers[i].userId }
  //     }
  //   }

  //   usersOption[1].childs = formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))

  //   setUsers(usersOption)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [oneDriveConf.team, oneDriveConf.default?.users?.[oneDriveConf.team]])

  return (
    <div className="pos-rel d-flx w-5">
      <div className="pos-rel d-flx flx-col w-8">
        <TableCheckBox onChange={openUploadFileMdl} checked={'attachments' in oneDriveConf.actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Upload Files', 'bit-integration-pro')} subTitle={__('Add attachments from Bit-integration-pro to OneDrive folder.', 'bit-integration-pro')} />
        <small style={{ marginLeft: 30, marginTop: 10, color: 'red', fontWeight: 'bold' }}>{__('This Required', 'bit-integrations')}</small>
      </div>

      {/* <Modal
        md
        show={actionMdl.show === 'attachments'}
        setModal={clsActionMdl}
        title={__('Select Attachment', 'bit-integration-pro')}
      >
        <div className="o-a" style={{ height: '95%' }}>
          <div className="mt-2">{__('Select file upload fields', 'bit-integration-pro')}</div>
          <MultiSelect
            defaultValue={oneDriveConf.actions.attachments}
            className="mt-2 w-5"
            options={getFileUpFields()}
            onChange={(val) => actionHandler(val, 'attachments')}
          />

          {oneDriveConf.default?.teamFolders?.[oneDriveConf.team]?.[folder]?.type === 'private'
            && (
              <>
                <div className="btcd-hr mt-2" />
                <div className="flx mt-2">
                  <div>Share with users: (optional)</div>
                  <button onClick={() => refreshUsers(formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Team Users"' }} type="button" disabled={isLoading}>&#x21BB;</button>
                </div>
                {isLoading
                  && (
                    <Loader style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 45,
                      transform: 'scale(0.5)',
                    }}
                    />
                  )}
                {
                  oneDriveConf.actions?.share?.file?.permissions?.map((permission, i) => (
                    <div key={permission.accessLabel} className="flx flx-between mt-2">
                      <MultiSelect
                        defaultValue={permission.email}
                        className="btcd-paper-drpdwn w-7 mr-2"
                        onChange={(val) => handleShareSetting(i, 'email', val, 'file')}
                        options={users}
                      />
                      <input type="text" value={permission.accessLabel} className="btcd-paper-inp w-3" readOnly />
                    </div>
                  ))
                }
                <TableCheckBox onChange={(e) => actionHandler(e, 'mail', 'file')} checked={oneDriveConf?.actions?.share?.file?.mail === 'true' || false} className="wd-100 mt-4 mr-2" value="true" title={__('Send Notification Mail', 'bit-integration-pro')} />
              </>
            )}
        </div>
      </Modal> */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'attachments'}
        close={() => setActionMdl({ show: false })}
        action={() => setActionMdl({ show: false })}
        title={__('Select Attachment', 'bitform')}
      >
        <div style={{ height: '95%' }}>
          <div className="mt-2">{__('Select file upload fields', 'bitform')}</div>
          <MultiSelect
            defaultValue={oneDriveConf.actions.attachments}
            className="mt-2 w-10 mb-25"
            options={getFileUpFields()}
            onChange={(val) => actionHandler(val, 'attachments')}
            height={300}
          />

        </div>
      </ConfirmModal>

      <div className="pos-rel d-flx flx-col w-8">
        <TableCheckBox
          checked={oneDriveConf.actions?.delete_from_wp || false}
          onChange={(e) => actionDeleteHandler(e, 'deleteFile')}
          className="mt-4 mr-2"
          value="delete_from_wp"
          title={__('Delete File From Wordpress', 'bit-integrations')}
          subTitle={__(
            'Delete file from Wordpress after upload in OneDrive',
            'bit-integrations',
          )}
        />
      </div>
    </div>
  )
}
