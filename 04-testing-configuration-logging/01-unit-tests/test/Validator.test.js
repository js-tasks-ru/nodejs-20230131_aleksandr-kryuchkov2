const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      it('валидатор проверяет наличие поля', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({title: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      });
      it('валидатор проверяет, что поле string', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 15});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });
      it('валидатор проверяет Lalala', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });
      it('валидатор проверяет LalalaLalalaLalalaLalala', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'LalalaLalalaLalalaLalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
      });
    });
    describe('валидатор проверяет числовые поля', () => {
      it('валидатор проверяет наличие поля', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({title: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      });
      it('валидатор проверяет, что поле number', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: 'old'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });
      it('валидатор проверяет значение 6', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: 6});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 6');
      });
      it('валидатор проверяет значение 32', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: 32});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 32');
      });
    });
    describe('иные проверки', () => {
      it('валидатор проверяет, что поле иного типа чем string или number отработает правильно',
          () => {
            const validator = new Validator({
              age: {
                type: 'number',
                min: 18,
                max: 27,
              },
            });

            const errors = validator.validate({age: true});

            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('field').and.to.be.equal('age');
            expect(errors[0]).to.have.property('error').and.to.be.
                equal('expect number, got boolean');
          });
      it('валидатор проверяет, что поле number или string ' +
          'даже если в валидатор добавить иной тип данных',
      () => {
        const validator = new Validator({
          age: {
            type: 'boolean',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: true});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('wrong type in validator');
      });
    });
  });
});
