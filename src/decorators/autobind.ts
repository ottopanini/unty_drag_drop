namespace App {

    export function Autobind(_: any, _2: string, propertyDescriptor: PropertyDescriptor) {
        const orginalMethod = propertyDescriptor.value;
        const adjDescriptor: PropertyDescriptor = {
            configurable: true,
            get() {
                const boundFn = orginalMethod.bind(this);
                return boundFn;
            }
        }

        return adjDescriptor;
    }
}
