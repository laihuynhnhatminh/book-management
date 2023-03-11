// Mongodb init files
db = db.getSiblingDB('book-management');

db.createCollection('users');
db.createCollection('roles');
db.createCollection('books');

db.users.insertMany([
	{
		_id: ObjectId('63fdad90a40d61c25b50ff9d'),
		email: 'minh@minh.com',
		password: 'Minh123456',
		firstName: 'Minh',
		lastName: 'Nhat',
		enabled: true,
		role_id: '1',
		tokens: []
	},
	{
		_id: ObjectId('63fdae3fa40d61c25b50ff9e'),
		email: 'minhlai@minh.com',
		password: 'Minh123456',
		firstName: 'Minh',
		lastName: 'Lai',
		enabled: true,
		role_id: '2',
		tokens: []
	},
	{
		_id: ObjectId('63fed0407b81a43237e1f115'),
		email: 'minhnhat@minh.com',
		password: 'Minh123456',
		firstName: 'Minh',
		lastName: 'Nhat',
		enabled: false,
		role_id: '2',
		tokens: []
	}
]);

db.roles.insertMany([
	{
		_id: '1',
		name: 'Admin'
	},
	{
		_id: '2',
		name: 'User'
	}
]);

db.books.insertMany([
	{
		_id: ObjectId('63fef5b681a4fe5f9ffda95a'),
		title: 'A Song of Ice and Fire',
		author: 'George R. R. Martin',
		enabled: true,
		user_id: ObjectId('63fdad90a40d61c25b50ff9d')
	},
	{
		_id: ObjectId('63ff0899764d0fef16c8ed4e'),
		title: 'A Game of Thrones',
		author: 'George R. R. Martin',
		enabled: true,
		user_id: ObjectId('63fdae3fa40d61c25b50ff9e')
	},
	{
		_id: ObjectId('63ff123d23bf5116157097e4'),
		title: "Harry Potter and the Philosopher's Stone",
		author: 'J. K. Rowling',
		enabled: false,
		user_id: ObjectId('63fdad90a40d61c25b50ff9d')
	},
	{
		_id: ObjectId('63ff127f23bf5116157097ee'),
		title: 'The Return of the King',
		author: 'J. R. R. Tolkien',
		enabled: true,
		user_id: ObjectId('63fdad90a40d61c25b50ff9d')
	},
	{
		_id: ObjectId('63ff12fd23bf511615709802'),
		title: 'Eragon',
		author: 'Christopher Paolini',
		enabled: true,
		user_id: ObjectId('63fdae3fa40d61c25b50ff9e')
	},
	{
		_id: ObjectId('63ff218b57427d4c8793430c'),
		title: 'The Three Musketeers',
		author: 'Alexandre Dumas',
		enabled: false,
		user_id: ObjectId('63fdae3fa40d61c25b50ff9e')
	},
	{
		_id: ObjectId('64016200b954eef4eecc9892'),
		title: 'The Perfect Insider',
		author: 'Hiroshi Mori',
		enabled: false,
		user_id: ObjectId('63fdae3fa40d61c25b50ff9e')
	},
	{
		_id: ObjectId('64054bf08dc3b4b980a2fe49'),
		title: 'The Perfect Outsider',
		author: 'Hiroshi Mori',
		enabled: true,
		user_id: ObjectId('63fdad90a40d61c25b50ff9d')
	},
	{
		_id: ObjectId('64054c0b8dc3b4b980a2fe53'),
		title: 'A Certain Magical Index',
		author: 'Kazuma Kamachi',
		enabled: true,
		user_id: ObjectId('63fdad90a40d61c25b50ff9d')
	},
	{
		_id: ObjectId('64054c5a8dc3b4b980a2fe99'),
		title: 'A Certain Scientific Railgun',
		author: 'Kazuma Kamachi',
		enabled: true,
		user_id: ObjectId('63fdad90a40d61c25b50ff9d')
	}
]);
