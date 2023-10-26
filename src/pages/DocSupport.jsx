import { Suspense, useEffect, useState } from 'react'
import SnackMsg from '../components/Utilities/SnackMsg'
import ExternalLinkIcn from '../resource/img/supportIcon/ExternalLinkIcn'
import FacebookIcn from '../resource/img/supportIcon/FbIcon'
import MailIcn from '../resource/img/supportIcon/MailIcon'
import MessagesCircle from '../resource/img/supportIcon/MessengerIcon'
import ReviewStarIcn from '../resource/img/supportIcon/ReviewStarIcon'
import YoutubeIcn from '../resource/img/supportIcon/YoutubeIcon'
import { __ } from '../Utils/i18nwrap'
import Loader from '../components/Loaders/Loader'

function DocSupport() {
  const [snack, setSnackbar] = useState({ show: false })
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Bit-Apps-Pro/products/main/lists.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data.product)
      })
  }, [])

  return (
    <div className="btcd-f-settings">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx flx-center flx-wrp pb-3">
        {products && products.map((product, i) => product.slug !== 'bit-integrations' && (
          <div
            key={`inte-sm-${i + 2}`}
            role="button"
            tabIndex="0"
            className="btcd-inte-card product-sm mr-4 mt-3"
            style={{ width: '200px', height: 'max-content', textAlign: 'center' }}
          >

            <img loading="lazy" src={product.image} alt={product.slug} style={{ maxHeight: '90px' }} />
            <div className="txt-center px-2 f15">
              {product.name}
            </div>
            <br />
            <div className="flx flx-center ml-2" style={{ minHeight: '50px' }}>
              <span>{product.description}</span>
            </div>
            <div className="flx flx-center">
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn btcd-btn-o-blue btcd-btn-sm">
                <i className="fas fa-external-link-alt" />
                <span className="pl-1">Go to plugin</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      <div id="btcd-settings-wrp" style={{ padding: '0px 30px' }}>
        <div>
          <h2>Documentation</h2>
          <p>
            Bit Integrations is a user-friendly automation plugin for WordPress that makes work flows simple, easy to understand, and does not require extensive documentation. However, if you do get confused, the documentation is available for assistance and can be found
            <a target="_blank" href="https://docs.bit-integrations.bitapps.pro/" rel="noreferrer">
              {' '}
              here
              {' '}
              <ExternalLinkIcn size="15" />
            </a>
          </p>
        </div>
        <div />
      </div>
      <div id="btcd-settings-wrp" style={{ padding: '0px 30px' }}>
        <h2>Support</h2>
        <p>In Bit Apps, we provide all kind product support for any types of customer, it does not matter FREE or PRO user. We actively provide support through Email and Live Chat. Our support team is always ready to help you. We are here to answer your questions and help you with any issues you may have.</p>
        <div className="flx">
          <span>
            <MailIcn size="18" />
          </span>
          <span className="m-3">
            <a href="mailto:support@bitapps.pro" rel="noreferrer">
              support@bitapps.pro
            </a>
          </span>
        </div>
        <div className="flx">
          <span>
            <MessagesCircle size="20" />
          </span>
          <span className="m-3">
            <a href="https://tawk.to/chat/60eac4b6d6e7610a49aab375/1faah0r3e" target="_blank" rel="noreferrer">
              Chat here
              {' '}
              <ExternalLinkIcn size="15" />
            </a>
          </span>
        </div>
        <div className="flx">
          <span>
            <YoutubeIcn size="20" />
          </span>
          <span className="m-3">
            <a href="https://www.youtube.com/channel/UCjUl8UGn-G6zXZ-Wpd7Sc3g" target="_blank" rel="noreferrer">
              You tube channel
              {' '}
              <ExternalLinkIcn size="15" />
            </a>
          </span>
        </div>
        <div className="flx">
          <span>
            <FacebookIcn size="15" />
          </span>
          <span className="m-3">
            <a href="https://www.facebook.com/groups/3308027439209387" target="_blank" rel="noreferrer">
              Facebook support group
              {' '}
              <ExternalLinkIcn size="15" />
            </a>
          </span>
        </div>
        <div className="flx">
          <span>
            <ReviewStarIcn size="15" />
          </span>
          <span className="m-3">
            <a href="https://wordpress.org/support/plugin/bit-form/reviews/#new-post" target="_blank" rel="noreferrer">
              Rate us on WordPress
              {' '}
              <ExternalLinkIcn size="15" />
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default DocSupport

{ /* <h2>Support</h2>
<p>In Bit Apps, we provide all kind product support for any types of customer, it doesn't matter FREE or PRO user. We actively provide support through Email and Live Chat. Our support team is always ready to help you. We are here to answer your questions and help you with any issues you may have.</p>
</div>
<div className="flx flx-col flx" style={{ width: '250px', alignItems: 'flex-start' }}>
<h2>Need Help?</h2>
<span>support@bitapps.pro</span>
<a target="_blank" href="https://tawk.to/chat/60eac4b6d6e7610a49aab375/1faah0r3e" rel="noreferrer">Chat here</a>
<a target="_blank" href="https://www.youtube.com/channel/UCjUl8UGn-G6zXZ-Wpd7Sc3g" rel="noreferrer">BitApps youtube channel</a>
<a target="_blank" href="https://www.facebook.com/groups/3308027439209387" rel="noreferrer">Facebook support group</a> */ }
