(function() {
    Date.prototype.strftime = function (f) {
        if (!this.isValid()) return 'invalid date';
        f = f || '%x %X';
        f = formats[f.toLowerCase()] || f; // replace short-hand with actual format
        var d = this;
        return f.replace(/%([a-z%])/gi,
            function($0, $1){
                switch ($1){
                    case 'a': return Date.getMsg('days')[d.get('day')].substr(0, 3);
                    case 'A': return Date.getMsg('days')[d.get('day')];
                    case 'b': return Date.getMsg('months')[d.get('month')].substr(0, 3);
                    case 'B': return Date.getMsg('months')[d.get('month')];
                    case 'c': return d.toString();
                    case 'd': return pad(d.get('date'), 2);
                    case 'D': return d.get('date');
                    case 'e': return d.get('date');
                    case 'H': return pad(d.get('hr'), 2);
                    case 'I': return ((d.get('hr') % 12) || 12);
                    case 'j': return pad(d.get('dayofyear'), 3);
                    case 'm': return pad((d.get('mo') + 1), 2);
                    case 'M': return pad(d.get('min'), 2);
                    case 'o': return d.get('ordinal');
                    case 'p': return Date.getMsg(d.get('ampm'));
                    case 's': return Math.round(d / 1000);
                    case 'S': return pad(d.get('seconds'), 2);
                    case 'U': return pad(d.get('week'), 2);
                    case 'w': return d.get('day');
                    case 'x': return d.format(Date.getMsg('shortDate'));
                    case 'X': return d.format(Date.getMsg('shortTime'));
                    case 'y': return d.get('year').toString().substr(2);
                    case 'Y': return d.get('year');
                    case 'T': return d.get('GMTOffset');
                    case 'Z': return d.get('Timezone');
                    case 'z': return pad(d.get('ms'), 3);
                }
                return $1;
            }
        );
    };
})();
