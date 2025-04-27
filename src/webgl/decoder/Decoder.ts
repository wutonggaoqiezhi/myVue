import * as protobuf from 'protobufjs';
class Decoder {

    dam: protobuf.Root
    modeldata: protobuf.Root;

    constructor() {

        protobuf.load("proto/dam.proto", ( err, root) => {
            if (err) throw err;
            this.dam = root
        });

        protobuf.load("proto/vision.proto", ( err, root) => {
            if (err) throw err;
            this.modeldata = root
        });

    }


}

export default new Decoder();