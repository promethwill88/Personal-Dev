public class ContactsListHandler {
	
	private String sortOrder = 'LastName'; // sortOrder - private method to be used on SOQL query

	public List<Contact> getContacts() { // Getter method - pull data out of controller onto your page
		List<Contact> res = Database.query ( // SOQL Query
				'SELECT Id, FirstName, LastName, Title, Email ' + 
				'FROM Contact ' +
				'ORDER BY ' + sortOrder + ' ASC ' + // ASC is ascending (DESC is descending)
				'LIMIT 10'
			);
		return res;
	}

	// Add 2 methods that can be called to toggle sortOrder
	public void sortByLastName() { 
		this.sortOrder = 'LastName';
	}

	public void sortByFirstName() {
		this.sortOrder = 'FirstName';
	}
    
}