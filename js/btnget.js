function loadDBfull(arrayBuffer) {
  setIsLoading(true);

  resetTableList();

  setTimeout(function () {
      var tables;
      try {
          db = db.prepare("SELECT * FROM sqlite_master WHERE type='table' ORDER BY name");

          //Get all table names from master table
          tables = db.prepare("SELECT * FROM sqlite_master WHERE type='table' ORDER BY name");

          //bo = db.prepare("SELECT sum(sl) as tong FROM (SELECT sl FROM item where name like 'Bò%') AS subquery");
          //mi = db.prepare("SELECT sum(sl) as tong FROM (SELECT sl FROM item where name like 'Mì%') AS subquery");
      } catch (ex) {
          setIsLoading(false);
          alert(ex);
          return;
      }

      var firstTableName = null;
      var tableList = $("#tables");

      while (tables.step()) {
          var rowObj = tables.getAsObject();
          var name = "order";//var name = rowObj.name;

          if (firstTableName === null) {
              firstTableName = name;
          }
          var rowCount = getTableRowsCount(name);
          rowCounts[name] = rowCount;
          tableList.append('<option value="' + name + '">' + name + ' (' + rowCount + ' rows)</option>');
      }

      //Select first table and show It
      tableList.select2("val", firstTableName);
      doDefaultSelect(firstTableName);

      $("#output-box").fadeIn();
      $(".nouploadinfo").hide();
      $("#sample-db-link").hide();
      $("#dropzone").delay(50).animate({height: 50}, 500);
      $("#success-box").show();

      setIsLoading(false);
  }, 50);
}
