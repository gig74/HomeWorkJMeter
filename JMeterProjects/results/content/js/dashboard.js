/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.03139013452915, "KoPercent": 8.968609865470851};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4327354260089686, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "HTTP Request Add 815"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP  Request auth"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 812"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 811"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 813"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "HTTP Request get by id 809"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 808"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 807"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "HTTP Request get by id 806"], "isController": false}, {"data": [0.45, 500, 1500, "HTTP Request get by id 805"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 804"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request get by id 803"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 802"], "isController": false}, {"data": [0.45, 500, 1500, "HTTP Request get by id 801"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 800"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 820"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request Add 810"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Pet show avalable"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 805"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 804"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 801"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request Add 800"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 803"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 802"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Add 808"], "isController": false}, {"data": [0.45, 500, 1500, "HTTP Request get by id 819"], "isController": false}, {"data": [0.35, 500, 1500, "HTTP Request get by id 818"], "isController": false}, {"data": [0.2, 500, 1500, "HTTP Request get by id 817"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 816"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 815"], "isController": false}, {"data": [0.3, 500, 1500, "HTTP Request get by id 814"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request get by id 813"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "HTTP Request get by id 812"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "HTTP Request get by id 811"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request get by id 810"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 223, 20, 8.968609865470851, 1002.2600896860982, 526, 1593, 943.0, 1440.6, 1501.9999999999998, 1574.08, 89.70233306516492, 74.63985820595333, 13.373328137570393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request Add 815", 3, 0, 0.0, 703.0, 693, 720, 696.0, 720.0, 720.0, 720.0, 2.8142589118198873, 1.294449167448405, 0.9454151031894934], "isController": false}, {"data": ["HTTP  Request auth", 1, 0, 0.0, 1441.0, 1441, 1441, 1441.0, 1441.0, 1441.0, 1441.0, 0.6939625260235947, 0.32665032963219987, 0.13350646252602358], "isController": false}, {"data": ["HTTP Request Add 812", 3, 0, 0.0, 1147.3333333333333, 1081, 1268, 1093.0, 1268.0, 1268.0, 1268.0, 2.0408163265306123, 0.9406887755102041, 0.6875797193877551], "isController": false}, {"data": ["HTTP Request Add 811", 1, 0, 0.0, 1462.0, 1462, 1462, 1462.0, 1462.0, 1462.0, 1462.0, 0.6839945280437756, 0.3159466911764706, 0.23111533857729138], "isController": false}, {"data": ["HTTP Request Add 813", 2, 0, 0.0, 908.0, 906, 910, 908.0, 910.0, 910.0, 910.0, 1.8281535648994516, 0.844449840036563, 0.6177159506398537], "isController": false}, {"data": ["HTTP Request get by id 809", 11, 0, 0.0, 1004.3636363636364, 653, 1593, 939.0, 1570.6000000000001, 1593.0, 1593.0, 4.568106312292359, 2.105611503322259, 0.5888574543189369], "isController": false}, {"data": ["HTTP Request get by id 808", 10, 0, 0.0, 926.0, 640, 1357, 933.0, 1333.6000000000001, 1357.0, 1357.0, 4.342162396873643, 2.001465479808945, 0.5597318714719931], "isController": false}, {"data": ["HTTP Request get by id 807", 11, 0, 0.0, 985.6363636363636, 650, 1395, 953.0, 1388.2, 1395.0, 1395.0, 4.5738045738045745, 2.108238045738046, 0.5895919958419958], "isController": false}, {"data": ["HTTP Request get by id 806", 11, 0, 0.0, 999.7272727272729, 658, 1566, 913.0, 1553.8, 1566.0, 1566.0, 4.617968094038623, 2.133104402812762, 0.5952849496221663], "isController": false}, {"data": ["HTTP Request get by id 805", 10, 0, 0.0, 1043.5999999999997, 679, 1511, 969.0, 1498.0, 1511.0, 1511.0, 4.512635379061372, 2.080042870036101, 0.5817069043321299], "isController": false}, {"data": ["HTTP Request get by id 804", 9, 0, 0.0, 1058.6666666666665, 646, 1442, 990.0, 1442.0, 1442.0, 1442.0, 3.800675675675676, 1.7555855415962838, 0.4899308488175676], "isController": false}, {"data": ["HTTP Request get by id 803", 10, 5, 50.0, 1013.4, 667, 1395, 979.5, 1394.6, 1395.0, 1395.0, 4.177109440267335, 1.770376461988304, 0.5384555137844611], "isController": false}, {"data": ["HTTP Request get by id 802", 7, 0, 0.0, 1023.5714285714286, 677, 1482, 830.0, 1482.0, 1482.0, 1482.0, 2.933780385582565, 1.36088445620285, 0.37818262782900247], "isController": false}, {"data": ["HTTP Request get by id 801", 10, 0, 0.0, 984.4000000000002, 642, 1563, 925.5, 1551.2, 1563.0, 1563.0, 4.282655246252677, 1.9698541220556745, 0.5520610278372591], "isController": false}, {"data": ["HTTP Request get by id 800", 10, 0, 0.0, 959.8, 651, 1395, 912.0, 1393.5, 1395.0, 1395.0, 4.282655246252677, 1.9824009635974305, 0.5520610278372591], "isController": false}, {"data": ["HTTP Request get by id 820", 10, 0, 0.0, 954.7, 668, 1391, 938.0, 1372.5, 1391.0, 1391.0, 4.257130693912303, 1.9705858876117495, 0.5487707535121328], "isController": false}, {"data": ["HTTP Request Add 810", 1, 0, 0.0, 1567.0, 1567, 1567, 1567.0, 1567.0, 1567.0, 1567.0, 0.6381620931716656, 0.29539925015954055, 0.21625219368219528], "isController": false}, {"data": ["HTTP Request Pet show avalable", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 160.76520912547528, 0.341611216730038], "isController": false}, {"data": ["HTTP Request Add 805", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.6788475699558173, 0.4961915500736377], "isController": false}, {"data": ["HTTP Request Add 804", 2, 0, 0.0, 708.5, 647, 770, 708.5, 770.0, 770.0, 770.0, 2.3866348448687353, 1.1024201968973748, 0.8064215393794749], "isController": false}, {"data": ["HTTP Request Add 801", 1, 0, 0.0, 1366.0, 1366, 1366, 1366.0, 1366.0, 1366.0, 1366.0, 0.7320644216691069, 0.33672103770131767, 0.24592789165446557], "isController": false}, {"data": ["HTTP Request Add 800", 1, 0, 0.0, 1557.0, 1557, 1557, 1557.0, 1557.0, 1557.0, 1557.0, 0.6422607578676942, 0.29729648362235067, 0.21764109666024406], "isController": false}, {"data": ["HTTP Request Add 803", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.5899285600255427, 0.4315333652618135], "isController": false}, {"data": ["HTTP Request Add 802", 4, 0, 0.0, 1019.25, 919, 1165, 996.5, 1165.0, 1165.0, 1165.0, 2.700877785280216, 1.2528485820391626, 0.9178764348413234], "isController": false}, {"data": ["HTTP Request Add 808", 1, 0, 0.0, 1422.0, 1422, 1422, 1422.0, 1422.0, 1422.0, 1422.0, 0.7032348804500703, 0.3241473277074543, 0.23692972046413505], "isController": false}, {"data": ["HTTP Request get by id 819", 10, 0, 0.0, 970.5, 661, 1576, 925.0, 1542.1000000000001, 1576.0, 1576.0, 4.3140638481449525, 1.996939710957722, 0.5561097929249352], "isController": false}, {"data": ["HTTP Request get by id 818", 10, 3, 30.0, 983.4, 667, 1513, 950.5, 1488.7, 1513.0, 1513.0, 4.32152117545376, 1.9003720559636992, 0.5570710890233362], "isController": false}, {"data": ["HTTP Request get by id 817", 10, 5, 50.0, 989.0, 667, 1556, 954.0, 1523.7, 1556.0, 1556.0, 4.327131112072696, 1.831847008870619, 0.5577942449156209], "isController": false}, {"data": ["HTTP Request get by id 816", 10, 0, 0.0, 992.7, 685, 1451, 975.0, 1434.4, 1451.0, 1451.0, 4.32152117545376, 1.9919511668107173, 0.5570710890233362], "isController": false}, {"data": ["HTTP Request get by id 815", 7, 0, 0.0, 1114.0, 883, 1423, 1070.0, 1423.0, 1423.0, 1423.0, 3.5842293906810037, 1.648605510752688, 0.4620295698924731], "isController": false}, {"data": ["HTTP Request get by id 814", 10, 4, 40.0, 1019.6999999999999, 682, 1448, 987.0, 1447.2, 1448.0, 1448.0, 4.345936549326379, 1.8750339526292914, 0.5602183833116036], "isController": false}, {"data": ["HTTP Request get by id 813", 8, 2, 25.0, 1049.625, 704, 1451, 1075.5, 1451.0, 1451.0, 1451.0, 3.4497628288055195, 1.5278002371711945, 0.4446959896507115], "isController": false}, {"data": ["HTTP Request get by id 812", 7, 1, 14.285714285714286, 986.7142857142856, 696, 1476, 911.0, 1476.0, 1476.0, 1476.0, 3.0501089324618733, 1.3731447440087146, 0.3931781045751634], "isController": false}, {"data": ["HTTP Request get by id 811", 9, 0, 0.0, 1004.2222222222222, 703, 1568, 911.0, 1568.0, 1568.0, 1568.0, 3.9164490861618795, 1.8090629079634464, 0.5048547650130548], "isController": false}, {"data": ["HTTP Request get by id 810", 10, 0, 0.0, 974.8, 721, 1490, 901.0, 1470.2, 1490.0, 1490.0, 4.194630872483222, 1.9416553062080537, 0.5407141359060403], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 20, 100.0, 8.968609865470851], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 223, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request get by id 803", 10, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request get by id 818", 10, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request get by id 817", 10, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request get by id 814", 10, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request get by id 813", 8, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request get by id 812", 7, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
