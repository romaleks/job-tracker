import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/shadcn/pagination'

type PaginationItemValue = number | 'ellipsis'

interface JobPaginationProps {
  page: number
  totalPages: number
  isFetching?: boolean
  onPageChange: (page: number) => void
}

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItemValue[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PaginationItemValue[] = [1]
  const startPage = Math.max(2, currentPage - 1)
  const endPage = Math.min(totalPages - 1, currentPage + 1)

  if (startPage > 2) {
    items.push('ellipsis')
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page)
  }

  if (endPage < totalPages - 1) {
    items.push('ellipsis')
  }

  items.push(totalPages)

  return items
}

const JobPagination = ({
  page,
  totalPages,
  isFetching = false,
  onPageChange,
}: JobPaginationProps) => {
  const pageItems = getPaginationItems(page, totalPages)

  return (
    <div className="flex flex-col items-center gap-3 pt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.max(1, page - 1))
              }}
              className={
                page === 1 || isFetching ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {pageItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(item)
                  }}
                  className={isFetching ? 'pointer-events-none opacity-50' : ''}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.min(totalPages, page + 1))
              }}
              className={
                page === totalPages || isFetching
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
    </div>
  )
}

export default JobPagination
