function executeTK() {
    var query = "SELECT idkey, [table], count(*)  as sl, sum(price) as total FROM 'order' WHERE [table] is not null and checkout==1 GROUP BY [table]";
    renderQueryTK(query);
    $("#tables").select2("val", getTableNameFromQuery(query));
}
function renderQueryTK(query) {
    var dataBox = $("#data");
    var thead = dataBox.find("thead").find("tr");
    var tbody = dataBox.find("tbody");

    thead.empty();
    tbody.empty();
    errorBox.hide();
    dataBox.show();

	
    var columnTypes = [];
    var tableName = getTableNameFromQuery(query);
    if (tableName != null) {
        columnTypes = getTableColumnTypes(tableName);
    }

    var sel;
    try {
        sel = db.prepare(query);
    } catch (ex) {
        showError(ex);
        return;
    }

    var addedColums = false;
   var stt=1;
   var total=0;
    while (sel.step()) {
        if (!addedColums) {
            addedColums = true;
		   thead.append('<th><span data-toggle="tooltip" data-placement="top" title="string">stt</span></th>');
		   thead.append('<th><span data-toggle="tooltip" data-placement="top" title="string">table</span></th>');
		   thead.append('<th><span data-toggle="tooltip" data-placement="top" title="string">sl</span></th>');
		   thead.append('<th><span data-toggle="tooltip" data-placement="top" title="string">price</span></th>');
		   
		  
            /*var columnNames = sel.getColumnNames();
            for (var i = 0; i < columnNames.length; i++) {
                var type = columnTypes[columnNames[i]];
                thead.append('<th><span data-toggle="tooltip" data-placement="top" title="' + type + '">' + columnNames[i] + "</span></th>");
            }*/
        } 

        var tr = $('<tr>');
        var s = sel.get();
        for (var i = 0; i < s.length; i++) {
           if(i==0){
               tr.append('<td><span title="' + htmlEncode(s[i]) + '">' + stt + '</span></td>');
           }
           else{
              if(i==3){
                 total+=s[i];
                 tr.append('<td><span title="' + htmlEncode(s[i]) + '">' + htmlEncode(Number(s[i]).toLocaleString()) + '</span></td>');
              }
              else{
                     tr.append('<td><span title="' + htmlEncode(s[i]) + '">' + htmlEncode(s[i]) + '</span></td>');
                 }
            }
        }
        tbody.append(tr);
       stt++;
    }
	$('#total').text("Total: "+Number(total).toLocaleString());
    refreshPagination(query, tableName);

    $('[data-toggle="tooltip"]').tooltip({html: true});
    dataBox.editableTableWidget();

    setTimeout(function () {
        positionFooter();
    }, 100);
}
