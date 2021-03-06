import React from 'react';
import profileServices from '../../services/profile';
import userHelper from 'focus-core/user';
import {component as Popin} from 'focus-components/application/popin';
import moment from 'moment';

export default React.createClass({
    displayName: 'BadgesView',
    getInitialState() {
        return {};
    },
    componentWillMount() {
        profileServices.getInfoBadges(this.props.id).then((res) => {
            this.computeBadgesTypes(res);
        })
    },
    computeBadgesTypes(res) {
        let allBadges = res.allBadges;
        let badgesRecus = res.badgesRecus;
        let bronze = [];
        let argent = [];
        let or = [];
        let platinium = [];
        let allAquired = [];
        let mapCount = {};
        allBadges.map(item => {
            mapCount[item._id] = 0;
        })
        let badgesWithDate = res.allBadges;
        if (badgesRecus && badgesRecus.length > 0) {
            badgesRecus.map(badgeRecu => {
                var badgeDef = allBadges.find(elt => {return elt._id === badgeRecu.badge});
                var badgeDef = badgesWithDate.find(elt => {return elt._id === badgeRecu.badge});
                if (!badgeDef.dateRecu  || badgeDef.dateRecu.isBefore( moment(badgeRecu.dateRecu, moment.ISO_8601))) {
                    badgeDef.dateRecu = moment(badgeRecu.dateRecu, moment.ISO_8601);
                }
                allAquired.push(badgeDef);
                mapCount[badgeDef._id] = mapCount[badgeDef._id]+1;
                if (badgeDef.code === 'Platinium') {
                    platinium.push(badgeRecu);                    
                } else if (badgeDef.code === 'Or') {
                    or.push(badgeRecu);
                } else if(badgeDef.code === 'Argent') {
                    argent.push(badgeRecu);
                } else {
                    bronze.push(badgeRecu);
                } 
            })
        }
        badgesWithDate.sort((b1,b2) => {
            if (!b1.dateRecu && !b2.dateRecu) {
                return 0;
            }
            if (!b1.dateRecu && b2.dateRecu) {
                return 1;
            }
            if (b1.dateRecu && !b2.dateRecu) {
                return -1;
            }
            if (b1.dateRecu.isBefore(b2.dateRecu)) {
                return 1;
            }
            if (b1.dateRecu.isAfter(b2.dateRecu)) {
                return -1;
            }
            return 0;
        })
        this.setState({allBadges, badgesRecus, badgesWithDate,bronze, argent, or, platinium, allAquired, mapCount});
    },
    computeBadgeFor(data, className) {
        if (data && data.length > 0) {
            return <div >
                    <div className={className} />
                    <label>{' '+data.length}</label>
                </div>
        } else {
            if ((!this.state.badgesRecus || this.state.badgesRecus.length === 0) && className === 'Bronze') {
                return <div >
                    <div className={className} />
                    <label>{' 0'}</label>
                </div>
            }
        }
    },
    togglePopin() {
        this.props.togglePopinBadge(this.state);
    },
    closePopin() {
        this.setState({showPopin: false});
    },
    /** @inheritDoc */
    render() {
        return (
            <div data-focus='badges-line'>
                <div data-focus='round-line' onClick={this.togglePopin}>
                    {this.computeBadgeFor(this.state.bronze, 'Bronze')}
                    {this.computeBadgeFor(this.state.argent, 'Argent')}
                    {this.computeBadgeFor(this.state.or, 'Or')}
                    {this.computeBadgeFor(this.state.platinium, 'Platinium')}
                </div>
            </div>
        );
    }
});
