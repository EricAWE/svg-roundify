roundify
===

Lightweight svg round chart built with snapsvg

## Requirements
* snapsvg

## Init

```html
    <div id="my-div-container"></div>

    <script>
    /**
     * Data for the roundify plugin
     */
    var data = [
        {
            value : 3210,
            name  : 'seo',
            color : 'blue'
        },
        {
            value : 600,
            name  : 'sea',
            color : 'orange'
        },{
            ...
        }
    ];

    var round = new Roundify('my-div-container', data);
    </script>
```

## Options
``` javascript
    circle : {
        // The position of the circle. match : /center|top/
        pos       : 'center',
        // Le radius du cercle
        radius    : 100,
        // The stroke of the circle
        stroke    : 8,
        // The colors of each arc
        colors    : ['#3498db', '#1abc9c', '#9b59b6'],
        // Animations options
        animation : {
            type : 'parallel' // match : /parallel|smooth|false/
        }
    },
    legend : {
        // Position of the legend. match : /right|top/
        pos    : 'right',
        // Font's attributes for the legend
        font   : {
            fontFamily : '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize   : '14px',
            fill       : '#575757'
        }
    }
```

###### License
This project is under the MIT License.
