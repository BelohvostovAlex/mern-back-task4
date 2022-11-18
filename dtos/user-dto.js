export default class UserDto {
	id;
	status;
	name;

	constructor(model) {
		this.status = model.status;
		this.id = model._id;
		this.name = model.name;
	}
}
