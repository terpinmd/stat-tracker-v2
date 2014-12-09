'use strict';

(function() {
	// Sports Controller Spec
	describe('Sports Controller Tests', function() {
		// Initialize global variables
		var SportsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Sports controller.
			SportsController = $controller('SportsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sport object fetched from XHR', inject(function(Sports) {
			// Create sample Sport using the Sports service
			var sampleSport = new Sports({
				name: 'New Sport'
			});

			// Create a sample Sports array that includes the new Sport
			var sampleSports = [sampleSport];

			// Set GET response
			$httpBackend.expectGET('sports').respond(sampleSports);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sports).toEqualData(sampleSports);
		}));

		it('$scope.findOne() should create an array with one Sport object fetched from XHR using a sportId URL parameter', inject(function(Sports) {
			// Define a sample Sport object
			var sampleSport = new Sports({
				name: 'New Sport'
			});

			// Set the URL parameter
			$stateParams.sportId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sports\/([0-9a-fA-F]{24})$/).respond(sampleSport);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sport).toEqualData(sampleSport);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sports) {
			// Create a sample Sport object
			var sampleSportPostData = new Sports({
				name: 'New Sport'
			});

			// Create a sample Sport response
			var sampleSportResponse = new Sports({
				_id: '525cf20451979dea2c000001',
				name: 'New Sport'
			});

			// Fixture mock form input values
			scope.name = 'New Sport';

			// Set POST response
			$httpBackend.expectPOST('sports', sampleSportPostData).respond(sampleSportResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sport was created
			expect($location.path()).toBe('/sports/' + sampleSportResponse._id);
		}));

		it('$scope.update() should update a valid Sport', inject(function(Sports) {
			// Define a sample Sport put data
			var sampleSportPutData = new Sports({
				_id: '525cf20451979dea2c000001',
				name: 'New Sport'
			});

			// Mock Sport in scope
			scope.sport = sampleSportPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sports\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sports/' + sampleSportPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sportId and remove the Sport from the scope', inject(function(Sports) {
			// Create new Sport object
			var sampleSport = new Sports({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sports array and include the Sport
			scope.sports = [sampleSport];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sports\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSport);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sports.length).toBe(0);
		}));
	});
}());