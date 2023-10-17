
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../GlobalStates'
import ChangelogIcn from '../Icons/ChangeLogIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import { __ } from '../Utils/i18nwrap'
import Modal from '../components/Utilities/Modal'

export default function ChangelogToggle() {
    const btcbi = useRecoilValue($btcbi)
    const [show, setShow] = useState(btcbi.changelogVersion !== btcbi.version)
    const version = btcbi.isPro ? '1.4.2' : '1.5.1'
    return (
        <div className="changelog-toggle">
            <button
                title={('What\'s New')}
                type="button"
                className="changelog-btn"
                onClick={() => setShow(true)}
            >
                {/* <QuestionIcn size={25} /> */}
                <ChangelogIcn size={25} />
            </button>
            <Modal sm show={show} setModal={setShow} >
                <div className='changelog'>
                    {/* <h4 className='changelog-notif'> From 1.4.1 update,To use pro plugin free version is required. </h4> */}
                    <div className="flx flx-col flx-center whats-new">
                        <h3>What's New in {version}?</h3>
                        <small>18th October 2023</small>
                    </div>
                    <div className='changelog-content'>
                        {/* <h4>New Integration</h4>
                        <p>New Integration</p> */}
                        {/* <span className='new-integration' style={{ background: "cornflowerblue" }}><b>New Triggers</b></span>

                        <div className='integration-list'>
                            <ul>
                                <li>BitForm</li>
                                <li>Academy LMS</li>
                            </ul>
                        </div>

                        <span className='new-integration'><b>New Integrations</b></span>

                        <div className='integration-list'>
                            <ul>
                                <li>Academy LMS</li>
                                <li>Moxie CRM</li>
                                <li>Woodpecker</li>
                                <li>WP Fusion</li>
                            </ul>
                        </div> */}

                        <span className='fixes'><b>Fixed</b></span>

                        <div className='fixes-list'>
                            <ul>
                                <li>Post create isssue fixed</li>
                                <li>Woo-commerce multiple user create issue fixed</li>
                                <li>Insightly log data issue fixed</li>
                                <li>Mailjet integration name edit issue fixed</li>
                                <li>Suitedash custom field & address field blank issue fixed</li>
                                <li>Groundhogg email field issue fixed</li>
                                <li>Asana custom field & logHandler message issue fixed</li>
                                <li>Gravitec Custom field "#" issue fixed</li>
                                <li>Airtable select box issue fixed</li>
                                <li>TinyMCE loading issue fixed</li>
                                <li>Telegram checkbox, selectbox, datetime data sending issue fixed</li>
                                <li>Groundhog trigger edit, add tag & remove tag issue fixed</li>
                                <li>BuddyBoss logHandler message issue fixed</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <span className='footer'>{__('For more details,')}</span>
                        <a href="https://bitapps.pro/docs/bit-integrations/free-changelogs/" target="_blank" rel="noreferrer">
                            {__('Click here ')}
                            <ExternalLinkIcn size="14" />
                        </a>
                    </div>
                </div>
            </Modal >
        </div >
    )
}