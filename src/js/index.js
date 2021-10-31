console.log('index.js loading...');

$(function () {
    console.log("ready!");
});

var lays = {};
var selectedFile; // TODO: necessary

init();

/**
 * web app entry
 */
function init() {
    loadSourceFiles();
    initFileSelectorListener();
    initLayerSelectorsListener();
}

/**
 * this is to load source json files
 */
function loadSourceFiles() {
    if (sourceFileNamesArr && sourceFileNamesArr.length > 0) {
        console.log('source file names array', sourceFileNamesArr);
        for (var fileName of sourceFileNamesArr) {
            console.log('fileName', fileName);
            $('#file-selector').append($('<option>', {
                value: fileName,
                text: fileName.replace('.json', '')
            }));
        }
        // readFile(); // read first file by default
    } else {
        console.error('no source files detected, please checkout sourceFileNamesArr');
    }
}

/**
 * this is to read selected file
 * @param selectedFile selected file name in 1st select ele
 */
function readSelectedFile(selectedFile) {
    clearLayerSelectors();
    var json = selectedFile || 'EDI.json';
    var url = domain + fileRelativePath + json;
    $.getJSON(url, function (data) {
        console.log('loadFiles', data)
        lays = data;
        for (var lay in data) {
            console.log('lay', lay);
            var layArr = data[lay];
            console.log('layArr', layArr);
            var firstLay = layArr[0] || {};
            console.log('firstLay', firstLay);
            var schema = firstLay.SCHEMA || '';
            var TABLE = firstLay.TABLE || '';
            if (schema && TABLE) {
                var opt = schema + '.' + TABLE;
                $('#select2').append($('<option>', {
                    value: lay,
                    text: opt
                }));
            }
            //
            var secondLay = layArr[1] || {};
            var schema2 = secondLay.SCHEMA || '';
            var TABLE2 = secondLay.TABLE || '';
            if (schema2 && TABLE2) {
                var opt2 = schema2 + '.' + TABLE2;
                $('#select3').append($('<option>', {
                    value: lay,
                    text: opt2
                }));
            }
            //
            var third = layArr[2] || {};
            console.log('third', third);
            var schema3 = third.SCHEMA || '';
            var TABLE3 = third.TABLE || '';
            var opt3 = schema3 + '.' + TABLE3;
            if (schema3 && TABLE3) {
                $('#select4').append($('<option>', {
                    value: lay,
                    text: opt3
                }));
            }
            // console.log('lay', lay, 'inserted');
        }
    });
}

/**
 * this is to initialize file selector
 */
function initFileSelectorListener() {
    $('#file-selector').on('change', function (el) {
        // console.log('el', el)
        var selectedFile = $('#file-selector').val();
        console.log('selectedFile', selectedFile)
        readSelectedFile(selectedFile);
    });
}

/**
 * this is to initialize 3 layer selectors
 */
function initLayerSelectorsListener() {
    $('#select2').on('change', function (el) {
        // console.log('el', el)
        console.log('select2', this.value);
        var selectedIndex = $('#select2').val();
        $('#select3').val(selectedIndex);
        $('#select4').val(selectedIndex);
        generateResult(selectedIndex);
    });
    $('#select3').on('change', function (el) {
        // console.log('el', el)
        console.log('select3', this.value);
        var selectedIndex = $('#select3').val();
        $('#select2').val(selectedIndex);
        $('#select4').val(selectedIndex);
        generateResult(selectedIndex);

    });
    $('#select4').on('change', function (el) {
        // console.log('el', el)
        console.log('select4', this.value);
        var selectedIndex = $('#select4').val();
        $('#select2').val(selectedIndex);
        $('#select3').val(selectedIndex);
        generateResult(selectedIndex);
    });
}

function generateResult(index) {
    console.log('generateResult lays', lays);
    var selectedData = lays[index];
    console.log('generateResult selectedData', selectedData);
    if (selectedData && selectedData.length > 0) {
        var str = '';
        var tags = '';
        for (var lay of selectedData) {
            if (!isEmptyObject(lay) && !isActualArray(lay)) {
                console.log('this is not an empty object');
                var SCHEMA = lay.SCHEMA || '';
                var TABLE = lay.TABLE || '';
                console.log('SCHEMA', SCHEMA)
                console.log('TABLE', TABLE, isActualArray(TABLE))
                if (isActualArray(TABLE)) {
                    var finalTabStr = ''
                    for (var subTab of TABLE) {
                        console.log('subTab', subTab);
                        finalTabStr += SCHEMA + '.' + subTab + '<br>';
                    }
                    tags += generateResultElement(finalTabStr);
                } else {
                    str += SCHEMA + '.' + TABLE + separator; // not used
                    tags += generateResultElement(SCHEMA + '.' + TABLE);
                }
            }
        }
        str = str.substring(0, str.lastIndexOf(separator) - 1);
    }
    $('#result').text(str);
    $('#results').html(tags);
}

/**
 * this is to clear 3 layer selectors options when selected file changes
 */
function clearLayerSelectors() {
    $('#select2').empty().append($('<option>', {
        disabled: true,
        selected: true,
        text: layerSelectorText
    }));
    $('#select3').empty().append($('<option>', {
        disabled: true,
        selected: true,
        text: layerSelectorText
    }));
    $('#select4').empty().append($('<option>', {
        disabled: true,
        selected: true,
        text: layerSelectorText
    }));
    $('#result').text('');
}

function isEmptyObject(obj) {
    return obj // null and undefined check
        && Object.keys(obj).length === 0
        && Object.getPrototypeOf(obj) === Object.prototype;
}

function isActualArray(arr) {
    return Array.isArray(arr);
}
function generateResultElement(text) {
    return '<span class="result-tag">' + text + '</span>';
}
