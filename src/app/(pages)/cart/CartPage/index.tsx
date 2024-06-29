'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import CartItem from '../CartItem'

import classes from './index.module.scss'

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const { settings } = props
  const { productsPage } = settings || {}

  const { user } = useAuth()

  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={'flex flex-row gap-2 items-center'}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Button href={`/${productsPage.slug}`} label={'Shop Now'} appearance="primary" />
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cartWrapper}>
              <div>
                {/* CART LIST HEADER */}
                <div className={classes.header}>
                  <p className="text-brand-dark text-b18 font-normal leading-headingLH2">
                    Products
                  </p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p></p>
                    <p className="text-brand-dark text-b18 font-normal leading-headingLH2">
                      Quantity
                    </p>
                  </div>
                  <p className="text-brand-dark text-b18 font-normal leading-headingLH2 text-end">
                    Subtotal
                  </p>
                </div>
                {/* CART ITEM LIST */}
                <ul className={classes.itemsList}>
                  {cart?.items?.map((item, index) => {
                    if (typeof item.product === 'object') {
                      const {
                        quantity,
                        product,
                        product: { id, title, meta, stripeProductID },
                      } = item

                      const isLast = index === (cart?.items?.length || 0) - 1

                      const metaImage = meta?.image

                      return (
                        <CartItem
                          product={product}
                          title={title}
                          metaImage={metaImage}
                          qty={quantity}
                          addItemToCart={addItemToCart}
                        />
                      )
                    }
                    return null
                  })}
                </ul>
              </div>

              <div className={[classes.summary, 'shadow-lg'].filter(Boolean).join(' ')}>
                <div className={classes.row}>
                  <h6 className="text-h6 text-brand-dark leading-headingLH2">Summary</h6>
                </div>

                {/* <div className={classes.row}>
                  <p className={classes.cartTotal}>Delivery Charge</p>
                  <p className={classes.cartTotal}>$0</p>
                </div> */}

                <div className={classes.row}>
                  <p className="text-b18 font-semibold leading-headingLH2 text-brand-dark">Total</p>
                  <p className={classes.cartTotal}>{cartTotal.formatted} LBP</p>
                </div>

                <Button
                  className={classes.checkoutButton}
                  href={'/checkout'}
                  label={'Checkout'}
                  // label={user ? 'Checkout' : 'Login to checkout'}
                  appearance="primary"
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
