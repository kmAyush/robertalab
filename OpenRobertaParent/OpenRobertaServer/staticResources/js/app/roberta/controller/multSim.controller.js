/**
 * Controller for multiple simulation part of the project
 */
define(['exports','util', 'progList.model', 'program.model','guiState.controller','guiState.model', 'jquery'],function(exports, UTIL, PROGLIST, PROGRAM_M,GUISTATE_C, GUISTATE_M, $){
    function init(){
        //currently does nothing
    }
    exports.init = init;
    
    function showListProg(){
        PROGLIST.loadProgList(function(result){
            if(result.rc === "ok"){
                $("#mtable").bootstrapTable('destroy'); //refreshing the table 
                $("#simModal .btn-primary").off('click'); // deleting any click event attached to this button 
                var dataarr = []; //Array having data to be displayed in table shown
                var programsparsed =0; //iterator for the synchronously running for loops
                var robottype = GUISTATE_M.gui.robot;
                if(result.programNames.length ===0){
                    $("#voidList").show(); // error reporting in the modal itself
                    $("#voidList").text("There is no saved program to be simulated. Please save the program and then run this feature"); //error message
                    $("#simModal .btn-primary").hide(); //hiding the run selected button
                }else{
                    $("#voidList").hide(); // hiding the error reporting part
                    $("#simModal .btn-primary").show(); // showing the run selected button if hidden
                }
                result.programNames.forEach(function(item, i, oriarray){
                    dataarr.push({name: item[0], robot: robottype, creator: item[1], date: item[4]});
                    programsparsed++;
                    if(programsparsed===oriarray.length ){ //the end of loop
                        $('#mtable').bootstrapTable({
                            height : 400,
                            sortName: "name",
                            toggle: "mtable",
                            iconsPrefix : 'typcn', 
                            search: true,
                            icons : {
                                paginationSwitchDown : 'typcn-document-text',
                                paginationSwitchUp : 'typcn-book',
                                refresh : 'typcn-refresh',
                            },
                            pagination : 'true',
                            buttonsAlign : 'right',
                            resizable : 'true',
                            
                            columns: [
                            {
                                field: 'name',
                                title: 'Program Name',
                                sortable: true
                            }, {
                                field: 'robot',
                                title: 'Robot Name',
                                sortable: true
                            },{
                                field: 'creator',
                                title: 'Creator',
                                sortable: true
                            },{
                                field: 'date',
                                title: 'Creation Date',
                                formatter : UTIL.formatDate,
                                sortable: true
                            },{
                                checkbox : true,
                                valign : 'middle',
                            }],
                            data: dataarr
                        });
                        $("#simModal .btn-primary").show();
                        //the css manipulation has been done in roberta.css
//                        $("#simModal .fixed-table-header").css({"background-color": "#B3BFB8"});
                        $("#simModal .btn-primary").on("click",function(){
                            console.log("Selections will be executed");
                            console.log('Selections obtained via getSelections: are ' + JSON.stringify($("#mtable").bootstrapTable('getSelections')));
                            alert("The following programs would be executed: "+ JSON.stringify($("#mtable").bootstrapTable('getSelections')));
                        });
                    }
                });
            }else{
                // the user is not logged in, this code might never be executed until the user deletes the disabled class and click the multiplication button
                console.log(result.message);
                $("#mtable").bootstrapTable('destroy'); //destroy the table if still present
                $("#simModal .btn-primary").hide();
            }
        });
    }
    exports.showListProg = showListProg;

    //deprecated as previously information about the robottype was fetched from the database but it was understood later that it can be directly extracted from guistate.model.js
    function showListProgOld(){
        console.log("guistate info is ");
        console.log(GUISTATE_M.gui.robot);
        PROGLIST.loadProgList(function(result){
            console.log(result);
            if(result.rc === "ok"){
                $("#mtable").bootstrapTable('destroy'); //refreshing the table
                var dataarr = []; //Array having data to be displayed in table shown
                var programsparsed =0; //iterator for the synchronously running for loops
                result.programNames.forEach(function(item, i, oriarray){
                    PROGRAM_M.loadProgramFromListing(item[0], item[1],item[3], function(dat){
                        //dat is the program result obtained for each item
                        var myparser = dat.programText;
                        var parser = new DOMParser();
                        var xmlDocm = parser.parseFromString(myparser,"text/xml");
                        var robottype = xmlDocm.documentElement.attributes.robottype.nodeValue; // it is the robot type , say ev3 for some program item
                        dataarr.push({name: item[0], robot: robottype, creator: item[1]});
                        programsparsed++;
                        if(programsparsed===oriarray.length ){ //the end of loop
                            $('#mtable').bootstrapTable({
                                height : 400,
                                sortName: "name",
                                toggle: "mtable",
                                iconsPrefix : 'typcn',
                                icons : {
                                    paginationSwitchDown : 'typcn-document-text',
                                    paginationSwitchUp : 'typcn-book',
                                    refresh : 'typcn-refresh',
                                },
                                pagination : 'true',
                                buttonsAlign : 'right',
                                resizable : 'true',
                                
                                columns: [
                                {
                                    field: 'name',
                                    title: 'Program Name',
                                    sortable: true
                                }, {
                                    field: 'robot',
                                    title: 'Robot Name',
                                    sortable: true
                                },{
                                    field: 'creator',
                                    title: 'Creator',
                                    sortable: true
                                },{
                                    checkbox : true,
                                    valign : 'middle',
                                }],
                                data: dataarr
                            });
                            $("#simModal .btn-primary").show();
                            //the css manipulation has been done in roberta.css
//                            $("#simModal .fixed-table-header").css({"background-color": "#B3BFB8"});
                            $("#simModal .btn-primary").on("click",function(){
                                console.log("Selections will be executed");
                                console.log('Selections obtained via getSelections: are ' + JSON.stringify($("#mtable").bootstrapTable('getSelections')));
                                alert("The following programs would be executed: "+ JSON.stringify($("#mtable").bootstrapTable('getSelections')));
                            });
                        }
                    });                     
                });
            }else{
                // the user is not logged in
                console.log(result.message);
                $("#mtable").bootstrapTable('destroy'); //destroy the table if still present
                $("#simModal .btn-primary").hide();
            }
        });
    }
    exports.showListProgOld = showListProgOld
});