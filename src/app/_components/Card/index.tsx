'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { Media } from '../Media'
import { Price } from '../Price'

import classes from './index.module.scss'

const priceFromJSON = (priceJSON): string => {
  let price = ''

  if (priceJSON) {
    try {
      const parsedPrice = parseFloat(priceJSON)
      price = parsedPrice.toLocaleString()
      // const parsed = JSON.parse(priceJSON)?.data[0]
      // const priceValue = parsed.unit_amount
      // const priceType = parsed.type
      // price = `${parsed.currency === 'usd' ? '$' : ''}${(priceValue / 100).toFixed(2)}`
      // if (priceType === 'recurring') {
      //   price += `/${
      //     parsed.recurring.interval_count > 1
      //       ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
      //       : parsed.recurring.interval
      //   }`
      // }
    } catch (e) {
      console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    }
  }

  return price
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, priceJSON } = {},
    className,
  } = props

  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(() => priceFromJSON(priceJSON))

  useEffect(() => {
    setPrice(priceFromJSON(priceJSON))
  }, [priceJSON])

  return (
    <div className={[className, 'bg-white flex flex-col'].filter(Boolean).join(' ')}>
      <Link
        href={href}
        className={
          'no-underline block relative w-full max-w-[330px] max-h-[350px] h-full min-h-[350px]'
        }
      >
        {!metaImage && (
          <div className={'flex items-center justify-center w-full h-full bg-slate-50'}>
            No image
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={'object-contain bg-white object-center'} resource={metaImage} fill />
        )}
      </Link>
      <div className={'flex flex-grow flex-col gap-5 justify-between w-full'}>
        <div className="flex flex-col gap-1">
          {showCategories && hasCategories && (
            <div className="flex flex-row gap-1 flex-wrap w-full">
              {categories?.map((category, index) => {
                if (typeof category === 'object' && category !== null) {
                  const { title: titleFromCategory } = category

                  const categoryTitle = titleFromCategory || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      <p className="text-b10 text-brand-primary leading-headingLH1 tracking-wide capitalize">
                        {categoryTitle}
                        {!isLast && <Fragment>, </Fragment>}
                        {/* {!isLast && <Fragment>, &nbsp;</Fragment>} */}
                      </p>
                    </Fragment>
                  )
                }

                return null
              })}
            </div>
          )}
          {titleToUse && (
            <p
              className={
                'm-0 text-brand-primary text-b16 leading-headingLH2 whitespace-nowrap text-ellipsis line-clamp-1'
              }
            >
              <Link
                href={href}
                className={
                  'no-underline text-brand-primary text-b16 leading-headingLH2 whitespace-nowrap line-clamp-1 text-ellipsis'
                }
              >
                {titleToUse}
              </Link>
            </p>
          )}
          {description && (
            <div className={'flex flex-grow m-0'}>
              {description && (
                <p
                  className={
                    'm-0 text-brand-primary text-b12 leading-subHeadingLH2 line-clamp-3 text-ellipsis'
                  }
                >
                  {sanitizedDescription}
                </p>
              )}
            </div>
          )}
        </div>
        {doc && <Price product={doc} />}
      </div>
    </div>
  )
}
