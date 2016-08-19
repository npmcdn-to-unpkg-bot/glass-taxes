// define an function to collect data and pass it to a callback
var get_data = function(url,data_callback){
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

var get_full_budget_data = get_data.bind(null,'/data/json_budget_files/Table 1.3—Summary of Receipts, Outlays, and Surpluses or Deficits (-) in Current Dollars, Constant (FY 2009) Dollars, and as Percentages of GDP: 1940–2021.json');
var get_full_fund_group_data = get_data.bind(null,'/data/json_budget_files/Table 1.4—Receipts, Outlays, and Surpluses or Deficits (-) by Fund Group: 1934–2021.json');

var access_identity = function(d){
    return d
}

var access_budget_gdp = function(d){
    return d['Surplus or Deficit (–) As Percentages of GDP'];
}

var access_budget_current_dollars = function(d){
    return d['Surplus or Deficit (–) In Current Dollars'];
}

var access_budget_fixed_dollars = function(d){
    return d['Surplus or Deficit (–) In Constant (FY 2009) Dollars'];
}

var access_receipt_by_fund_group_data = function(d){
    return d['Federal Funds Receipts'];
}

var formatting = {
    fill:function(d){
        // var t = this.props.accessData(d)
        if (d>0) return 'rgb(0,153,0)';
        else if (d<0) return 'rgb(204,0,0)';
        else return 'black';
    }
}

// render the data
ReactDOM.render(
    <div>
        <h1>GlassTaxes</h1>
        <h2>{'Surplus or Deficit (–) As Percentages of GDP'}</h2>
        <BasicBarChart height={300} width={500}
                       graph_id={'budget_gdp_data'} data={get_full_budget_data}
                       accessData={access_budget_gdp} formatting={formatting}/>

        <h2>{'Surplus or Deficit (–) In Current Dollars'}</h2>
        <BasicBarChart height={300} width={500}
                       graph_id={'budget_current_dollars_data'} data={get_full_budget_data}
                       accessData={access_budget_current_dollars} formatting={formatting}/>

        <h2>{'Surplus or Deficit (–) In Constant (FY 2009) Dollars'}</h2>
        <BasicBarChart height={300} width={500}
                       graph_id={'budget_fixed_dollars_data'} data={get_full_budget_data}
                       accessData={access_budget_fixed_dollars} formatting={formatting}/>
        <h2>{'Federal Funds Receipts'}</h2>
        <BasicBarChart height={300} width={500}
                       graph_id={'receipt_by_fund_group_data'} data={get_full_fund_group_data}
                       accessData={access_receipt_by_fund_group_data} formatting={formatting}/>

    </div>,
    document.getElementById('content')
);