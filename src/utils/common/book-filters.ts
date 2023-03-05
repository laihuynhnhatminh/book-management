// Updatable book fields
export const BOOK_PATCHABLE_FIELDS = [
	'enabled',
	'author',
	'title',
	'description'
];

// Queries for getting books
export const BOOK_NON_STRING_QUERIES = ['enabled'];
export const BOOK_STRING_QUERIES = ['title', 'author'];
export const COMMON_QUERIES = ['skip', 'limit', 'sortBy'];
