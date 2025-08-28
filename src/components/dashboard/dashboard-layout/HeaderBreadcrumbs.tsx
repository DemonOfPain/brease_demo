'use client'
import React from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/shadcn/ui/breadcrumb'
import { HomeIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

const HeaderBreadcrumbs = () => {
  const path = usePathname()
  const pathArray = path.split('/').filter((x) => x != '')
  const crumbsArray = pathArray.filter((x) => !/\d/.test(x))

  const formatBreadCrumb = (breadcrumb: string) => {
    if (breadcrumb && breadcrumb.includes('-')) {
      return breadcrumb
        .split('-')
        .map((word: string) => {
          return word[0].toUpperCase() + word.substring(1)
        })
        .join(' ')
    } else if (breadcrumb) {
      return breadcrumb.charAt(0).toUpperCase() + breadcrumb.substring(1)
    }
  }

  const generateBreadcrumbUrl = (pathArray: string[], index: number): string => {
    return '/' + pathArray.slice(0, index + 1).join('/')
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              prefetch
              href="/dashboard"
              className="flex flex-row gap-2 items-center hover:underline"
            >
              <HomeIcon className="w-4 h-4 stroke-brease-gray-9" /> Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbsArray.length < 3 ? (
          <div className="flex flex-row items-center gap-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formatBreadCrumb(crumbsArray[1])}</BreadcrumbPage>
            </BreadcrumbItem>
          </div>
        ) : (
          crumbsArray.slice(1, crumbsArray.length).map((breadcrumb, index) => (
            <div key={breadcrumb} className="flex flex-row items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    prefetch
                    href={generateBreadcrumbUrl(pathArray, index + 1)}
                    className="hover:underline"
                  >
                    {formatBreadCrumb(breadcrumb)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default HeaderBreadcrumbs
