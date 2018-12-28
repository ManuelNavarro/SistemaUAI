    /**
 * JQuery Organisation Chart Plugin.
 *
 * Author: Mark Lee
 * Copyright (C)2013-2015 Caprica Software Limited
 * http://www.capricasoftware.co.uk
 *
 * Contributions by: Paul Lautman <paul.lautman at gmail.com>
 *
 * This software is licensed under the Creative Commons Attribution-ShareAlike 3.0 License,
 * see here for license terms:
 *
 *     http://creativecommons.org/licenses/by-sa/3.0
 */
(function($) {

    $.fn.orgChartClone = function(options) {
        var opts = $.extend({}, $.fn.orgChartClone.defaults, options);

        return this.each(function() {
            var $chartSource = $(this);
            // Clone the source list hierarchy so levels can be non-destructively removed if needed
            // before creating the chart
            $this = $chartSource.clone();
            if (opts.levels > -1) {
                $this.find("ul").andSelf().filter(function() {return $chartSource.parents("ul").length+1 > opts.levels;}).remove();
            }
            // Store the original element
            $this.data("chart-source", $chartSource);
            // Build the chart...
            var $container = $("<div class='" + opts.chartClass + "'/>");
            if (opts.interactive) {
                $container.addClass("interactive");
            }
            // The chart may be sourced from either a "ul", or an "li" element...
            var $root;
            if ($this.is("ul")) {
                $root = $this.find("li:first");
            }
            else if ($this.is("li")) {
                $root = $this;
            }
            if ($root) {
                buildNode($root, $container, 0, 0, opts);
                // Special case for any hyperlink anchor in the chart to prevent the click on the node itself from propagating
                $container.find("div.node a").click(function(evt) {
                    evt.stopImmediatePropagation();
                });
                if(opts.replace) {
                    opts.container.empty();
                }
                opts.container.append($container);
            }
        });
    };

    $.fn.orgChartClone.defaults = {
        container  : $("body"),
        depth      : -1,
        levels     : -1,
        showLevels : -1,
        stack      : false,
        chartClass : "orgChart",
        hoverClass : "hover",
        nodeText   : function($node) {return $node.clone().children("ul,li").remove().end().html();},
        interactive: false,
        fade       : false,
        speed      : "slow",
        nodeClicked: function($node) {},
        copyClasses: true,
        copyData   : true,
        copyStyles : true,
        copyTitle  : true,
        replace    : true
    };

    function buildNode($node, $appendTo, level, index, opts) {
        var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>");
        var $tbody = $("<tbody/>");

        // Make this node...
        var $nodeRow = $("<tr/>").addClass("nodes");
        var $nodeCell = $("<td/>").addClass("node").attr("colspan", 2);
        var $childNodes = $node.children("ul:first").children("li");
        if ($childNodes.length > 1) {
            $nodeCell.attr("colspan", $childNodes.length*2);
        }

        var $adjunct = $node.children("adjunct").eq(0), nodosAdjuntos = new Array();
        $adjunct = $adjunct.children('i');
        if ($adjunct.length > 0) {
            for (var i = 0; i < $adjunct.length; i++) {
                
                var $downLineRow = $("<tr/>").addClass("lines");
                var $downLineCell = $("<td/>").attr("colspan", $childNodes.length*2);
                $downLineRow.append($downLineCell);

                var $downLineTable = $("<table cellpadding='0' cellspacing='0' border='0'>");
                $downLineTable.append("<tbody>");
                var $downLineLine = $("<tr/>").addClass("lines x");
                var $downLeft = $("<td>").addClass("line left");
                var $downRight = $("<td>").addClass("line right");
                $downLineLine.append($downLeft).append($downRight);
                $downLineLine.append($downLeft).append($downRight);


                var $adjunctItem = $adjunct[i];
                var $adjunctDiv = $("<div style='clear:both;'>").addClass("adjunct node").addClass("level"+level).addClass("node"+index).addClass("level"+level+"-node"+index).append($adjunctItem.innerHTML);
                var $linkDiv = $("<div>").addClass("adjunct-link");
                
                $downLineTable.children("tbody").append($downLineLine);
                $downLineCell.append($adjunctDiv);
                $downLineCell.append($linkDiv);

                $downLineCell.append($downLineTable);
                
                $adjunctItem.remove();
                
                nodosAdjuntos.push($downLineRow);


                var $downLineRow2 = $("<tr/>").addClass("lines");
                var $downLineCell2 = $("<td/>").attr("colspan", $childNodes.length*2);
                $downLineRow2.append($downLineCell2);

                var $downLineTable2 = $("<table cellpadding='0' cellspacing='0' border='0'>");
                $downLineTable2.append("<tbody>");
                var $downLineLine2 = $("<tr/>").addClass("lines x");
                var $downLeft2 = $("<td>").addClass("line left");
                var $downRight2 = $("<td>").addClass("line right");
                $downLineLine2.append($downLeft2).append($downRight2);
                $downLineLine2.append($downLeft2).append($downRight2);
                $downLineTable2.children("tbody").append($downLineLine2);
                $downLineCell2.append($downLineTable2);

                $adjunctDiv.hover(
                    function() {
                        var attr = $(this).attr('data-rel');
                        if(typeof attr === typeof undefined || attr === false){
                            $('[data-rel=popover]').removeAttr('data-placement');
                            $('[data-rel=popover]').removeAttr('data-content');
                            $('[data-rel=popover]').removeAttr('title');
                            $('[data-rel=popover]').popover('hide');
                            $('[data-rel=popover]').removeAttr('data-rel');
                        }
                        $(this).attr('data-rel','popover');
                        $(this).attr('data-placement','right');
                        if($('#unidadesCloneTable').DataTable().rows('.selected').data()[0][11] == "E"){ //EN EDICION
                            $(this).attr('data-content','<div class="widget-main no-padding">\
                                                            <p>\
                                                                <button class="btn btn-success btn-xs my-tooltip-link" title="Ver información de unidad" onClick="mostrarInfo('+ $(this).children()[0].value +');">\
                                                                    <i class="ace-icon fa fa-external-link bigger-110 icon-only"></i>\
                                                                </button> \
                                                                <button class="btn btn-info btn-xs my-tooltip-link"  title="Editar unidad" onClick="editarUnidad('+ $(this).children()[0].value +');">\
                                                                    <i class="ace-icon fa fa-pencil bigger-110 icon-only"></i>\
                                                                </button>\
                                                                <button class="btn btn-danger btn-xs my-tooltip-link" title="Eliminar unidad"  onClick="eliminarUnidad('+ $(this).children()[0].value +');">\
                                                                    <i class="ace-icon fa fa-trash-o bigger-110 icon-only"></i>\
                                                                </button>\
                                                            </p>\
                                                            <div class="center">\
                                                                <button type="button" class="btn btn-danger btn-xs" onclick="$(\'.popover\').hide();">\
                                                                    <i class="ace-icon fa fa-times"></i>\
                                                                    Cerrar\
                                                                </button>\
                                                            </div>\
                                                        </div>\
                            ');
                        }else{
                            $(this).attr('data-content','<div class="widget-main no-padding">\
                                                            <div class = "center">\
                                                                <button class="btn btn-success btn-xs my-tooltip-link" title="Ver información de unidad" onClick="mostrarInfo('+ $(this).children()[0].value +');">\
                                                                    <i class="ace-icon fa fa-external-link bigger-110 icon-only"></i>\
                                                            </div>\
                                                            <p>\
                                                            </p>\
                                                            <div class="center">\
                                                                <button type="button" class="btn btn-danger btn-xs" onclick="$(\'.popover\').hide();">\
                                                                    <i class="ace-icon fa fa-times"></i>\
                                                                    Cerrar\
                                                                </button>\
                                                            </div>\
                                                        </div>\
                            ');

                        }   
                        $(this).popover({html:true});
                        $(this).popover('show');
                        $(".tooltip").css("display", "none");
                        $('.my-tooltip-link').attr('data-placement','bottom');
                        $('.my-tooltip-link').tooltip({
                            container : 'body',
                            html: true,
                        }); 
                    }, 
                    function() {
                        ;
                    });

                nodosAdjuntos.push($downLineRow2);
            };
            $adjunct.remove();
        }

        /*if ($adjunct.length > 0) {
            alert($adjunct);
            var $adjunctDiv = $("<div>").addClass("adjunct node").addClass("level"+level).addClass("node"+index).addClass("level"+level+"-node"+index).append(opts.nodeText($adjunct));
            $adjunctDiv.appendTo($nodeCell);
            var $linkDiv = $("<div>").addClass("adjunct-link");
            $linkDiv.appendTo($nodeCell);
            $adjunct.remove();
        }*/

        var $heading = $("<h2 class=\'texto\'>").html(opts.nodeText($node));
        var $nodeDiv = $("<div>").addClass("node").addClass("level"+level).addClass("node"+index).addClass("level"+level+"-node"+index).append($heading);

        // Copy classes from the source list to the chart node
        if (opts.copyClasses) {
            $nodeDiv.addClass($node.attr("class"));
        }

        // Copy data from the source list to the chart node
        if (opts.copyData) {
            $nodeDiv.data($node.data());
        }

        // Copy CSS styles from the source list to the chart node
        if (opts.copyStyles) {
            $nodeDiv.attr("style", $node.attr("style"));
        }

        // Copy the title attribute from the source list to the chart node
        if (opts.copyTitle) {
            $nodeDiv.attr("title", $node.attr("title"));
        }

        $nodeDiv.data("orgchart-level", level).data("orgchart-node", $node);

        $nodeCell.append($nodeDiv);
        $nodeRow.append($nodeCell);
        $tbody.append($nodeRow);

        for (var i = 0; i < nodosAdjuntos.length; i++) {
            $tbody.append(nodosAdjuntos[i]);
        };

        $nodeDiv.click(function() {
            var $this = $(this);
            opts.nodeClicked($this.data("orgchart-node"), $this);
            if (opts.interactive) {
                var $row = $this.closest("tr");
                if ($row.next("tr").is(":visible")) {
                    if (opts.fade) {
                        $row.nextAll("tr").fadeOut(opts.speed);
                    }
                    else {
                        $row.nextAll("tr").hide();
                    }
                    $this.removeClass("shownChildren").addClass("hiddenChildren");
                }
                else {
                    $this.removeClass("hiddenChildren").addClass("shownChildren");
                    if (opts.fade) {
                        $row.nextAll("tr").fadeIn(opts.speed);
                    }
                    else {
                        $row.nextAll("tr").show();
                    }
                }
            }
        });



        if ($childNodes.length > 0) {
            if (opts.depth == -1 || level+1 < opts.depth) {
                var $downLineRow = $("<tr/>").addClass("lines");
                var $downLineCell = $("<td/>").attr("colspan", $childNodes.length*2);
                $downLineRow.append($downLineCell);

                var $downLineTable = $("<table cellpadding='0' cellspacing='0' border='0'>");
                $downLineTable.append("<tbody>");
                var $downLineLine = $("<tr/>").addClass("lines x");
                var $downLeft = $("<td>").addClass("line left");
                var $downRight = $("<td>").addClass("line right");
                $downLineLine.append($downLeft).append($downRight);
                $downLineTable.children("tbody").append($downLineLine);
                $downLineCell.append($downLineTable);

                $tbody.append($downLineRow);

                if ($childNodes.length > 0) {
                    $nodeDiv.addClass("hasChildren");
                    if (opts.showLevels == -1 || level < opts.showLevels-1) {
                        $nodeDiv.addClass("shownChildren");
                    }
                    else {
                        $nodeDiv.addClass("hiddenChildren");
                    }
                    if (opts.interactive) {
                        $nodeDiv.hover(
                            function() {
                                $(this).addClass(opts.hoverClass);
                                var attr = $(this).attr('data-rel');
                                if(typeof attr === typeof undefined || attr === false){
                                    $('[data-rel=popover]').removeAttr('data-placement');
                                    $('[data-rel=popover]').removeAttr('data-content');
                                    $('[data-rel=popover]').removeAttr('title');
                                    $('[data-rel=popover]').popover('hide');
                                    $('[data-rel=popover]').removeAttr('data-rel');
                                }

                                $(this).attr('data-rel','popover');
                                $(this).attr('data-placement','right');
                               if($('#unidadesCloneTable').DataTable().rows('.selected').data()[0][11] == "E"){
                                    $(this).attr('data-content','<div class="widget-main no-padding">\
                                                                    <p>\
                                                                        <button class="btn btn-success btn-xs my-tooltip-link" title="Ver información de unidad" onClick="mostrarInfo('+ $(this).children().children()[0].value +');">\
                                                                            <i class="ace-icon fa fa-external-link bigger-110 icon-only"></i>\
                                                                        </button>\
                                                                        <button class="btn btn-info btn-xs my-tooltip-link" title="Editar unidad" onClick="editarUnidad('+ $(this).children().children()[0].value +');">\
                                                                            <i class="ace-icon fa fa-pencil bigger-110 icon-only"></i>\
                                                                        </button>\
                                                                        <button class="btn btn-purple btn-xs my-tooltip-link" title="Editar orden de unidades" onClick="ordenUnidad('+ $(this).children().children()[0].value +');">\
                                                                            <i class="ace-icon fa fa-sort-amount-desc bigger-110 icon-only"></i>\
                                                                        </button>\
                                                                    </p>\
                                                                    <div class="center">\
                                                                        <button type="button" class="btn btn-danger btn-xs" onclick="$(\'.popover\').hide();">\
                                                                            <i class="ace-icon fa fa-times"></i>\
                                                                            Cerrar\
                                                                        </button>\
                                                                    </div>\
                                                                </div>\
                                            ');
                                }else{
                                    $(this).attr('data-content','<div class="widget-main no-padding">\
                                                                    <div class = "center">\
                                                                            <button class="btn btn-success btn-xs my-tooltip-link" title="Ver información de unidad" onClick="mostrarInfo('+ $(this).children().children()[0].value +');">\
                                                                                <i class="ace-icon fa fa-external-link bigger-110 icon-only"></i>\
                                                                    </div>\
                                                                    <p>\
                                                                    </p>\
                                                                    <div class="center">\
                                                                        <button type="button" class="btn btn-danger btn-xs" onclick="$(\'.popover\').hide();">\
                                                                            <i class="ace-icon fa fa-times"></i>\
                                                                            Cerrar\
                                                                        </button>\
                                                                    </div>\
                                                                </div>\
                                            ');
                                }
                                $(this).popover({html:true});
                                $(this).popover('show');
                                $(".tooltip").css("display", "none");
                                $('.my-tooltip-link').attr('data-placement','bottom');
                                $('.my-tooltip-link').tooltip({
                                    container : 'body',
                                    html: true,
                                }); 
                            }, 
                            function() {
                                $(this).removeClass(opts.hoverClass)
                                /*$(this).removeAttr('data-rel');
                                $(this).removeAttr('data-placement');
                                $(this).removeAttr('data-content');
                                $(this).removeAttr('title');
                                $(this).popover('hide');*/
                            });
                    }
                }

                // Recursively make child nodes...
                var $linesRow = $("<tr/>").addClass("lines v");
                $childNodes.each(function() {
                    var $left = $("<td/>").addClass("line left top");
                    var $right = $("<td/>").addClass("line right top");
                    $linesRow.append($left).append($right);
                });
                $linesRow.find("td:first").removeClass("top");
                $linesRow.find("td:last").removeClass("top");
                $tbody.append($linesRow);
                var $childNodesRow = $("<tr/>");
                $childNodes.each(function(index) {
                    var $td = $("<td/>");
                    $td.attr("colspan", 2);
                    buildNode($(this), $td, level+1, index, opts);
                    $childNodesRow.append($td);
                });
                $tbody.append($childNodesRow);
            }
            else if (opts.stack) {
                var $stackNodes = $childNodes.clone();
                var $list = $("<ul class='stack'>").append($stackNodes).addClass("level"+level).addClass("node"+index).addClass("level"+level+"-node"+index);
                var $stackContainer = $("<div class='stack-container'>").append($list);
                $nodeDiv.after($stackContainer);
            }
        }else{
            $nodeDiv.hover(
                function() {
                    var attr = $(this).attr('data-rel');
                    if(typeof attr === typeof undefined || attr === false){
                        $('[data-rel=popover]').removeAttr('data-placement');
                        $('[data-rel=popover]').removeAttr('data-content');
                        $('[data-rel=popover]').removeAttr('title');
                        $('[data-rel=popover]').popover('hide');
                        $('[data-rel=popover]').removeAttr('data-rel');
                    }
                    $(this).attr('data-rel','popover');
                    $(this).attr('data-placement','right');
                   if($('#unidadesCloneTable').DataTable().rows('.selected').data()[0][11] == "E"){
                        $(this).attr('data-content','<div class="widget-main no-padding">\
                                                        <p>\
                                                            <button class="btn btn-success btn-xs my-tooltip-link" title="Ver información de unidad" onClick="mostrarInfo('+ $(this).children().children()[0].value +');">\
                                                                <i class="ace-icon fa fa-external-link bigger-110 icon-only"></i>\
                                                            </button>\
                                                            <button class="btn btn-info btn-xs my-tooltip-link" title="Editar unidad" onClick="editarUnidad('+ $(this).children().children()[0].value +');">\
                                                                <i class="ace-icon fa fa-pencil bigger-110 icon-only"></i>\
                                                            </button>\
                                                            <button class="btn btn-danger btn-xs my-tooltip-link" title="Eliminar unidad" onClick = "eliminarUnidad('+ $(this).children().children()[0].value +');">\
                                                                <i class="ace-icon fa fa-trash-o bigger-110 icon-only"></i>\
                                                            </button>\
                                                        </p>\
                                                        <div class="center">\
                                                            <button type="button" class="btn btn-danger btn-xs" onclick="$(\'.popover\').hide();">\
                                                                <i class="ace-icon fa fa-times"></i>\
                                                                Cerrar\
                                                            </button>\
                                                        </div>\
                                                    </div>\
                                ');
                    }else{
                        $(this).attr('data-content','<div class="widget-main no-padding">\
                                                        <div class="center">\
                                                            <button class="btn btn-success btn-xs my-tooltip-link" title="Ver información de unidad" onClick="mostrarInfo('+ $(this).children().children()[0].value +');">\
                                                                <i class="ace-icon fa fa-external-link bigger-110 icon-only"></i>\
                                                        </div>\
                                                        <p>\
                                                        </p>\
                                                        <div class="center">\
                                                            <button type="button" class="btn btn-danger btn-xs" onclick="$(\'.popover\').hide();">\
                                                                <i class="ace-icon fa fa-times"></i>\
                                                                Cerrar\
                                                            </button>\
                                                        </div>\
                                                    </div>\
                                ');
                    }
                    //$(this).attr('title','Options');
                    $(this).popover({html:true});
                    $(this).popover('show');
                    $(".tooltip").css("display", "none");
                    $('.my-tooltip-link').attr('data-placement','bottom');
                    $('.my-tooltip-link').tooltip({
                        container : 'body',
                        html: true,
                    }); 
                }, 
                function() {
                    ;
                });
        }


        if (opts.showLevels > -1 && level >= opts.showLevels-1) {
            $nodeRow.nextAll("tr").hide();
        }


        $table.append($tbody);
        $appendTo.append($table);
    };

})(jQuery);


/*function mostrarInfo(id_nodo){
    jQuery.ajax({
        url: "/organizacion/modalInfo/",
        type: "POST",
        processData: true,
        data: "csrfmiddlewaretoken="+$("[name=csrfmiddlewaretoken]").val()+"&accion=mostrarInfo&id_nodo="+id_nodo,
        success: function(json){
            //alert(json);
            var empleado = "";
            var supervisor = "";
            var area = "";


            if(json['empleado'][0]){
                
                if(json['persona'][0]){
                    empleado = "<b>Nombre completo: </b>" + json['persona'][0]['nombre'] +" "+ json['persona'][0]['apellido'];
                    if(json['persona'][0]['telefono']){
                    empleado += "<b> Teléfono: </b>"+ json['persona'][0]['telefono'];
                    }
                   
                  
                }else{
                    empleado = "<b>Nombre de usuario </b>" + json['empleado'][0]['nombre_usuario'];
                }
                
                if(json['empleado'][0]['correo']){
                        empleado +=  "<b> Correo: </b>" + json['empleado'][0]['correo'];
                    }  
                            
            }else{
                empleado = "No existe responsable adjunto";
            }
            if(json['unidadSuper'][0]){
                supervisor = json['unidadSuper'][0]['nombre'];
            }else{
                supervisor = "No tiene unidad supervisora adjunta";
            }
            if(json['area'][0]){
                area = json['area'][0]['nombre'];
            }else{
                area = "No existe area encargada de la unidad";
            }

            document.getElementById("titulo").innerHTML = "<h4 class='modal-title' id='myModalLabel'>" 
                                                               + json['unidad'][0]['nombre'] + "<h4>"
            document.getElementById("div_info").innerHTML = "<table id='informacion' class='table table-striped table-bordered table-hover'> "+
                                                                "<tbody>"+
                                                                    "<tr>"+
                                                                       "<td  width = 20><b>ID UNIDAD:</b></td>"+
                                                                        "<td id = 'unidadInformacionID'>"+ json['unidad'][0]['unidad_id'] + "</td>" +
                                                                    "</tr>"+
                                                                    "<tr>"+
                                                                       "<td  width = 20><b>Código:</b></td>"+
                                                                        "<td id = 'unidadInformacionCodigo'>"+ json['unidad'][0]['codigo'] + "</td>" +
                                                                    "</tr>"+
                                                                    "<tr>"+
                                                                        "<td><b>Centro de costos:</b></td>"+
                                                                        "<td>"+ json['unidad'][0]['centro_costo_id'] + "</td>" +
                                                                    "</tr>"+
                                                                    "<tr>"+
                                                                        "<td><b>Descripción:</b></td>"+
                                                                        "<td>"+ json['unidad'][0]['descripcion'] + "</td>" +
                                                                    "</tr>"+ 
                                                                    "<tr>"+
                                                                        "<td><b>Responsable:</b></td>"+
                                                                        "<td>" + empleado + "</td>"+
                                                                    "</tr>"+
                                                                    "<tr>"+
                                                                        "<td><b>Dependencias directas:</b></td>"+
                                                                        "<td>"+ area + "</td>"+
                                                                    "</tr>"+
                                                                    "<tr>"+
                                                                        "<td><b>Unidad supervisora:</b></td>"+
                                                                        "<td>" + supervisor + "</td>"+
                                                                    "</tr>"+
                                                                "</tbody>"+
                                                            "</table>";
            $('#myModal2').modal('show');                                                               
        }
    });
}*/

function ordenUnidad(id_nodo){
    jQuery.ajax({
        url: "/organizacion/ordenUnidad/",
        type: "POST",
        processData: false,
        data: "csrfmiddlewaretoken="+$("[name=csrfmiddlewaretoken]").val()+"&id_nodo="+id_nodo,
        success: function(json){
            cad="<ol class=\"dd-list\">";
            $("#modal_orden").find("#id_unidad_padre").val(json[0]['unidad_id']);
            hijos=json[1];
            for(var i=0; i<hijos.length;i++){
                n=i+1;
                cad+="<li class=\"dd-item\" data-id=\"" + hijos[i]['unidad_id'] + "\"><div class=\"dd-handle\">"+ hijos[i]['nombre']+"</div></li>";
            }
            cad+="</ol>"
            //alert(cad);
            $("#modal_orden").find("#body_ordenUnidad").find(".dd").html(cad);
            $("#modal_orden").modal('show');
            $("#modal_orden").find("#titulo").html("Orden de " + json[0]['nombre']);
        }
    });
}

function editarUnidad(id_nodo){
    jQuery.ajax({
        url: "/organizacion/redirectUnidad/",
        type: "POST",
        processData: false,
        data: "csrfmiddlewaretoken="+$("[name=csrfmiddlewaretoken]").val()+"&unidad_id="+id_nodo,
        async: false,
        success: function(json){
            $("#clic_unidad").attr("href","/organizacion/unidad/"+json);
            $("#clic_unidad").attr("target","_blank");
            $("#clic_unidad")[0].click();
            
        }
    });
}


function eliminarUnidad(id_nodo){
bootbox.dialog({
        message: "¿Está seguro que desea inactivar la unidad?",
        title: "Inactivar unidad",
        show: true,
        backdrop: true,
        animate: true,
        buttons: {
            Aceptar: {
                label: "Si",
                className: "btn-info",
                callback: function() {
                    jQuery.ajax({
                        url: "/organizacion/modalInfo/",
                        type: "POST",
                        processData: false,
                        data: "csrfmiddlewaretoken="+$("[name=csrfmiddlewaretoken]").val()+"&accion=eliminarUnidad&id_nodo="+id_nodo,
                        success: function(json){
                            if(json[0] && json[0]['bandera']){
                                id_clone= $('#unidadesCloneTable').DataTable().rows('.selected').data()[0][1];
                                jQuery.ajax({
                                    url: "/organizacion/org/",
                                    type: "POST",
                                    processData: false,
                                    data: "csrfmiddlewaretoken="+$("[name=csrfmiddlewaretoken]").val()+"&accion=obtenerClonesUnidad&id_clone="+id_clone,
                                    success: function(html){
                                        document.getElementById("basic-stacking-source").innerHTML = html;
                                        $("#basic-stacking-source").orgChartClone({
                                                container: $("#clone_chart"), 
                                                interactive: true,
                                                fade: true,
                                                showLevels: 2,
                                                nodeClicked: onNodeClicked,
                                            });
                                    }
                                });
                                 create_alert("<li>Unidad desactivada de la relación entre unidades</li>","EXITO","notificaciones",true,6000);
                            }else{
                                 create_alert("<li>Error en la desactivación de la relación de unidad</li>","ERROR","notificaciones",true,6000);
                            }
                        }
                    });
                }
            },
            "Denegar": {
                label: "No",
                className: "btn-default",
                callback: function() {
                   bootbox.dialog({
                        message: "La operación ha sido cancelada",
                        closeButton: true,
                        backdrop: true,
                        onEscape: true,
                    });
                   
                }
            },
                
        }
    })
}
