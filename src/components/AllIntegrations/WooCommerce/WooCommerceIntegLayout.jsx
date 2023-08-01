/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-mixed-operators */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import WcLineItemsFieldMap from './WcLineItemsFieldMap'
import { getAllSubscriptionsProducts, refreshFields } from './WooCommerceCommonFunc'
import WooCommerceFieldMap from './WooCommerceFieldMap'

export default function WooCommerceIntegLayout({ formFields, handleInput, wcConf, setWcConf, isLoading, setIsLoading, setSnackbar }) {
  const addFieldMap = (indx, uploadFields, mod = '') => {
    const newConf = { ...wcConf }
    if (mod === 'line_item') {
      newConf.line_item.field_map.splice(indx, 0, {})
      setWcConf(newConf)
    } else {
      uploadFields ? newConf[module]?.upload_field_map.splice(indx, 0, {}) : newConf[module].field_map.splice(indx, 0, {})
    }

    setWcConf(newConf)
  }

  const [active, setActive] = useState({ customer: false, order: true })
  const [module, setModule] = useState(wcConf.module)

  useEffect(() => {
    setModule(wcConf.module)
  }, [wcConf?.module])

  const handleTabChange = (type) => {
    setModule(type)
    setActive({ [type]: true, [type === 'customer' ? 'order' : 'customer']: false })
  }

  const handleFilter = (e) => {
    const { value } = e.target
    const newConf = { ...wcConf }
    if (value === 'order-id') {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'order_id', required: true },
        { formField: '', wcField: 'order_status', required: true },
      ]
    } else if (value === 'email') {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'email', required: true },
        { formField: '', wcField: 'order_status', required: true },
      ]

      if (newConf?.orderchange) delete newConf.orderchange
    } else if (value === 'n-days' || value === 'n-weeks' || value === 'n-months') {
      const type = value[2] === 'd' ? 'n_days' : value[2] === 'w' ? 'n_weeks' : 'n_months'

      newConf.changestatus.field_map = [
        { formField: '', wcField: 'order_status', required: true },
        { formField: '', wcField: type, required: true },
      ]
    } else if (value === 'prev-months') {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'order_status', required: true },
      ]
    } else if (value === 'n-prev-months') {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'order_status', required: true },
        { formField: '', wcField: 'n_months', required: true },
      ]
    } else {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'order_status', required: true },
        { formField: '', wcField: 'from_date', required: true },
        { formField: '', wcField: 'to_date', required: true },

      ]
    }
    newConf.filterstatus = value
    setWcConf(newConf)
  }

  const handleOrderChange = (e) => {
    const { value } = e.target
    const newConf = { ...wcConf }
    if (value === 'date-order') {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'email', required: true },
        { formField: '', wcField: 'order_status', required: true },
        { formField: '', wcField: 'from_date', required: true },
        { formField: '', wcField: 'to_date', required: true },
      ]
    } else if (value === 'n-days-order' || value === 'n-weeks-order' || value === 'n-months-order' || value === 'n-prev-months-order') {
      const type = value[2] === 'd' ? 'n_days' : value[2] === 'w' ? 'n_weeks' : 'n_months'
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'email', required: true },
        { formField: '', wcField: 'order_status', required: true },
        { formField: '', wcField: type, required: true },
      ]
    } else {
      newConf.changestatus.field_map = [
        { formField: '', wcField: 'email', required: true },
        { formField: '', wcField: 'order_status', required: true },
      ]
    }
    newConf.orderchange = value
    setWcConf(newConf)
  }

  const moduleType = [
    { name: 'customer', label: 'Create-Customer' },
    { name: 'product', label: 'Create-Product' },
    { name: 'order', label: 'Create-Order' },
    { name: 'changestatus', label: 'Change Order Status' },
    { name: 'cancelSubscription', label: 'Cancel Subscription' },
  ]

  const filterStatus = [
    { name: 'order-id', label: 'Specific Order ID' },
    { name: 'email', label: 'Specific Customer Email' },
    { name: 'date-range', label: 'Specific Date Range' },
    { name: 'n-days', label: "Last N Day's Orders" },
    { name: 'n-weeks', label: "Last N Week's Orders" },
    { name: 'n-months', label: "Last N Month's Orders" },
    { name: 'prev-months', label: "Previous Month's Orders" },
    { name: 'n-prev-months', label: "Previous N Month's Orders" },
  ]

  const orderChange = [
    { name: 'latest-order', label: 'Latest Order' },
    { name: 'all-order', label: 'All Orders' },
    { name: 'date-order', label: 'Specific Date Range' },
    { name: 'n-days-order', label: "Last N Day's Orders" },
    { name: 'n-weeks-order', label: "Last N Week's Orders" },
    { name: 'n-months-order', label: "Last N Month's Orders" },
    { name: 'prev-months-order', label: "Previous Month's Orders" },
    { name: 'n-prev-months-order', label: "Previous N Month's Orders" },
  ]

  const changeHandler = (val, name) => {
    const newConf = { ...wcConf }
    if (name === 'productId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    setWcConf(newConf)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Module:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="module" value={wcConf.module} className="btcd-paper-inp w-5">
        <option value="">{__('Select Module', 'bit-integrations')}</option>
        {
          moduleType?.map(f => (
            <option key={`ff-rm-${f.name}`} value={f.name}>
              {f.label}
            </option>
          ))
        }
      </select>
      <br />
      {module === 'changestatus' && wcConf.default?.fields?.changestatus?.fields && (
        <>
          <br />
          <b className="wdt-200 d-in-b">{__('Filter:', 'bit-integrations')}</b>
          <select onChange={handleFilter} name="filterstatus" value={wcConf.filterstatus} className="btcd-paper-inp w-5">
            <option value="">{__('Select Filter Type', 'bit-integrations')}</option>

            {
              filterStatus?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))
            }

          </select>
          <br />
        </>
      )}
      {wcConf.filterstatus === 'email' && wcConf?.module === 'changestatus' && (
        <>
          <br />
          <b className="wdt-200 d-in-b">{__('Order Change:', 'bit-integrations')}</b>
          <select onChange={handleOrderChange} name="orderchange" value={wcConf?.orderchange} className="btcd-paper-inp w-5">
            <option value="">{__('Select Order Change Type', 'bit-integrations')}</option>
            {
              orderChange?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))
            }
          </select>
          <br />
        </>
      )}
      <br />
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}

      {wcConf.module === 'order' && (
        <div className="tab-box">
          <span className={`tab-item ${active.order && 'active'}`} onClick={() => handleTabChange('order')}>Order</span>
          <span className={`tab-item ${active.customer && 'active'}`} onClick={() => handleTabChange('customer')}>Customer</span>
        </div>
      )}

      {wcConf.module === 'cancelSubscription' && (
        <>
          <br />
          <div className="flx mt-1">
            <b className="wdt-200 d-in-b">{__('Select Product: ', 'bit-integrations')}</b>
            <MultiSelect
              className="w-5"
              defaultValue={wcConf?.productId}
              options={wcConf?.default?.allSubscriptionProducts && wcConf.default.allSubscriptionProducts.map((item) => ({ label: item.product_name, value: item.product_id }))}
              onChange={(val) => changeHandler(val, 'productId')}
              singleSelect
            />
            <button onClick={() => getAllSubscriptionsProducts(wcConf, setWcConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Subscription product', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
        </>
      )}

      {
        ((wcConf.default?.fields?.[module]?.fields && module !== 'changestatus')
          || (wcConf.default?.fields?.[module]?.fields && module === 'changestatus' && wcConf?.filterstatus !== 'email' && wcConf?.filterstatus)
          || (wcConf.default?.fields?.[module]?.fields && module === 'changestatus' && wcConf.filterstatus === 'email' && wcConf?.orderchange))
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
              <button onClick={() => refreshFields(wcConf, setWcConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('WooCommerce Fields', 'bit-integrations')}</b></div>
            </div>
            {wcConf[module].field_map.map((itm, i) => (
              <WooCommerceFieldMap
                key={`wc-m-${i + 9}`}
                i={i}
                field={itm}
                wcConf={wcConf}
                formFields={formFields}
                setWcConf={setWcConf}
                module={module}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button onClick={() => addFieldMap(wcConf[module].field_map.length)} className="icn-btn sh-sm" type="button">+</button>
            </div>
          </>
        )
      }

      {
        wcConf.default?.fields?.[module]?.uploadFields && module === 'product'
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map File Upload Fields', 'bit-integrations')}</b>
              <button onClick={() => refreshFields(wcConf, setWcConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('WooCommerce Fields', 'bit-integrations')}</b></div>
            </div>

            {wcConf[module].upload_field_map.map((itm, i) => (
              <WooCommerceFieldMap
                key={`wc-m-${i + 9}`}
                i={i}
                field={itm}
                wcConf={wcConf}
                formFields={formFields}
                setWcConf={setWcConf}
                uploadFields
                module={module}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button onClick={() => addFieldMap(wcConf[module].field_map.length, true)} className="icn-btn sh-sm" type="button">+</button>
            </div>
          </>
        )
      }

      {
        module === 'order'
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Line Items Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('WooCommerce Line Items Fields', 'bit-integrations')}</b></div>
            </div>

            {wcConf?.line_item?.field_map.map((itm, i) => (
              <WcLineItemsFieldMap
                key={`wc-m-${i + 9}`}
                i={i}
                field={itm}
                wcConf={wcConf}
                formFields={formFields}
                setWcConf={setWcConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2">
              <button onClick={() => addFieldMap(wcConf.line_item.field_map.length, false, 'line_item')} className="icn-btn sh-sm" type="button">+</button>
            </div>
          </>
        )
      }

      {/*
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />

      <WooCommerceProductActions
        wcConf={wcConf}
        setWcConf={setWcConf}
        formFields={formFields}
      /> */}
    </>
  )
}
