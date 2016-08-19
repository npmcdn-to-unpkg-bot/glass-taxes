// define an function to collect data and pass it to a callback
var get_data = function(url, parse_data, data_callback){
    //AJAX request for data
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (this.readyState === XMLHttpRequest.DONE){
            if (this.status == 200){
                var data = JSON.parse(this.responseText);
                data = data.map(parse_data);
                data_callback(data);
            }
        }
    }.bind(httpRequest);
    httpRequest.open('GET',url);
    httpRequest.send(null);
}

var get_full_data = function(url,data_callback){
    //AJAX request for data
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (this.readyState === XMLHttpRequest.DONE){
            if (this.status == 200){
                var data = JSON.parse(this.responseText);
                data_callback(data);
            }
        }
    }.bind(httpRequest);
    httpRequest.open('GET',url);
    httpRequest.send(null);
}

// specify data to render
var budget_gdp_data = {
    url: '/data/json_budget_files/Table 1.3—Summary of Receipts, Outlays, and Surpluses or Deficits (-) in Current Dollars, Constant (FY 2009) Dollars, and as Percentages of GDP: 1940–2021.json',
    field_name: 'Surplus or Deficit (–) As Percentages of GDP'
}
var budget_current_dollars_data = {
    url: '/data/json_budget_files/Table 1.3—Summary of Receipts, Outlays, and Surpluses or Deficits (-) in Current Dollars, Constant (FY 2009) Dollars, and as Percentages of GDP: 1940–2021.json',
    field_name: 'Surplus or Deficit (–) In Current Dollars'
}
var budget_fixed_dollars_data = {
    url: '/data/json_budget_files/Table 1.3—Summary of Receipts, Outlays, and Surpluses or Deficits (-) in Current Dollars, Constant (FY 2009) Dollars, and as Percentages of GDP: 1940–2021.json',
    field_name: 'Surplus or Deficit (–) In Constant (FY 2009) Dollars'
}

var receipt_by_fund_group_data = {
    url: '/data/json_budget_files/Table 1.4—Receipts, Outlays, and Surpluses or Deficits (-) by Fund Group: 1934–2021.json',
    field_name: 'Federal Funds Receipts'
}

var outlay_by_fund_group_data = {
    url: '/data/json_budget_files/Table 1.4—Receipts, Outlays, and Surpluses or Deficits (-) by Fund Group: 1934–2021.json',
    field_name: 'Federal Funds Receipts'
}

var get_full_budget_data = get_full_data.bind(null,budget_gdp_data['url']);

var get_budget_gdp_data = get_data.bind(
                                null,
                                budget_gdp_data['url'],
                                function(d){return d[budget_gdp_data['field_name']]});
var get_budget_current_dollars_data = get_data.bind(
                                            null,
                                            budget_current_dollars_data['url'],
                                            function(d){return d[budget_current_dollars_data['field_name']]});
var get_budget_fixed_dollars_data = get_data.bind(
                                            null,
                                            budget_fixed_dollars_data['url'],
                                            function(d){return d[budget_fixed_dollars_data['field_name']]});

var get_receipt_by_fund_group_data = get_data.bind(
                                            null,
                                            receipt_by_fund_group_data['url'],
                                            function(d){return d[receipt_by_fund_group_data['field_name']]});

var access_identity = function(d){
    return d
}

var access_budget_gdp = function(d){
    return d[budget_gdp_data['field_name']];
}

var formatting = {
    fill:function(d){
        d = d[budget_gdp_data['field_name']];
        console.log(d);
        if (d>0) return 'rgb(0,153,0)';
        else if (d<0) return 'rgb(204,0,0)';
        else return 'black';
    }
}

// render the data
ReactDOM.render(
    <div>
        <h1>GlassTaxes</h1>
        <h2>{budget_gdp_data['field_name']}</h2>
        <BasicBarChart height={300} width={500} graph_id={'budget_gdp_data'} data={get_full_budget_data} accessData={access_budget_gdp} formatting={formatting}/>
        <h2>{budget_current_dollars_data['field_name']}</h2>
        <AsyncBarChart height={300} width={500} graph_id={'budget_current_dollars_data'} get_data={get_budget_current_dollars_data}/>
        <h2>{budget_fixed_dollars_data['field_name']}</h2>
        <AsyncBarChart height={300} width={500} graph_id={'budget_fixed_dollars_data'} get_data={get_budget_fixed_dollars_data}/>
        <h2>{receipt_by_fund_group_data['field_name']}</h2>
        <AsyncBarChart height={300} width={500} graph_id={'receipt_by_fund_group_data'} get_data={get_receipt_by_fund_group_data}/>

    </div>,
    document.getElementById('content')
);