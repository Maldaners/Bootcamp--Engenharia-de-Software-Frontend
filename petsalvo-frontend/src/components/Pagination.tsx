import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'

interface PaginationProps<T> {
    currentPage: number
    items: T[]
    itemsPerPage: number
    onPageChange: (newPage: number) => void
}

export default function Pagination({
    currentPage,
    items,
    itemsPerPage,
    onPageChange,
}: PaginationProps<any>) {
    const totalPages = Math.ceil(items.length / itemsPerPage)

    const pageButtons = []
    for (let page = 1; page <= totalPages; page++) {
        pageButtons.push(
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={
                    currentPage === page
                        ? 'rounded-md border border-black shadow-md shadow-black/25 h-10 w-11 bg-purple-variant hover:bg-purple hover:text-white'
                        : 'rounded-md border border-black shadow-md shadow-black/25 h-10 w-11 bg-white hover:bg-purple hover:text-white'
                }
            >
                {page}
            </button>
        )
    }

    const next = () => {
        onPageChange(currentPage + 1)
    }

    const prev = () => {
        onPageChange(currentPage - 1)
    }

    return (
        <div className="flex items-center gap-4">
            <button
                className="flex items-center justify-center bg-purple-variant h-10 w-11 rounded-md border border-black disabled:opacity-50 enabled:hover:bg-purple enabled:hover:text-white"
                onClick={prev}
                disabled={currentPage === 1}
            >
                <PiCaretLeft className="text-xl" />
            </button>
            <div className="flex items-center gap-3">{pageButtons}</div>
            <button
                className="flex items-center justify-center bg-purple-variant h-10 w-11 rounded-md border border-black disabled:opacity-25 enabled:hover:bg-purple enabled:hover:text-white"
                onClick={next}
                disabled={currentPage === totalPages}
            >
                <PiCaretRight className="text-xl" />
            </button>
        </div>
    )
}
