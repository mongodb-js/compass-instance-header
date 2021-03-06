import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import InstanceHeaderPlugin from './plugin';

describe('InstanceHeader [Plugin]', () => {
  let component;

  beforeEach((done) => {
    component = mount(<InstanceHeaderPlugin sidebarCollapsed={false}/>);
    done();
  });

  afterEach((done) => {
    component = null;
    done();
  });

  it('should contain a <Provider /> with a store prop', () => {
    expect(component.find(Provider).first().props('store')).to.be.an('object');
  });
});
