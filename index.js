
var test_data = [-10, -5, -2, 4, 6, 20, 7, 3, 0, -2, -4,
                     -3, 0, 5, 3, 2, 1, 3, 8, 10];

var budget_data = {
    url: '/data/json_budget_files/Table 1.3—Summary of Receipts, Outlays, and Surpluses or Deficits (-) in Current Dollars, Constant (FY 2009) Dollars, and as Percentages of GDP: 1940–2021.json',
    field_name: 'Surplus or Deficit (–) As Percentages of GDP'
}

var get_data = function(data_callback){
    //AJAX request for data
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(resp){
        if (resp.readyState === XMLHttpRequest.DONE){
            // response is done
            if (resp.status == 200){
                // response is good
                var data = JSON.parse(resp.responseText);
                var transformed_data = data.map(function(d){return d[budget_data['field_name']]});
                data_callback(transformed_data);
            }
        }
    }.bind(this,httpRequest);
    httpRequest.open('GET',budget_data['url']);
    httpRequest.send(null);
}

ReactDOM.render(
    <div>
        <h1>GlassTaxes</h1>
        <h2>Sample Data</h2>
        <BarChart height={300} width={500} data={test_data} graph_id={'test_bar_chart'}/>
        <h2>{budget_data['field_name']}</h2>
        <AsyncBarChart height={300} width={500} graph_id={'total_budget_spend'} get_data={get_data}/>
    </div>,
    document.getElementById('content')
)