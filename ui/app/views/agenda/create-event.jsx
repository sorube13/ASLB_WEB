import React from 'react';
import Calendar from './calendar';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import agendaServices from '../../services/agenda';
import moment from 'moment';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'event',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data, date_debut : moment(this.props.data.start)};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            agendaServices.createEvent(data).then(this.props.onPopinClose);
            //request.execute(function(event) {that.props.onPopinClose()})
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.evenementDetail'>
                {this.fieldFor('name', {isEdit: true})}
                {this.fieldFor('date_debut', {isEdit: true})}
                {this.fieldFor('duree', {isEdit: true})}
                {this.fieldFor('limite', {isEdit: true})}
                {this.fieldFor('description', {isEdit: true})}
                <div>
                    <Button label='event.create' type='button' handleOnClick={this.create} />
                </div>
            </Panel>
        </div>
        );
    }
});