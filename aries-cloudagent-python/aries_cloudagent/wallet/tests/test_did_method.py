from unittest import TestCase


from ..key_type import KeyType

ED25519_PREFIX_BYTES = b"\xed\x01"
BLS12381G1_PREFIX_BYTES = b"\xea\x01"
BLS12381G1G2_PREFIX_BYTES = b"\xee\x01"
BLS12381G2_PREFIX_BYTES = b"\xeb\x01"
X25519_PREFIX_BYTES = b"\xec\x01"

ED25519_KEY_NAME = "ed25519"
X25519_KEY_NAME = "x25519"
BLS12381G1_KEY_NAME = "bls12381g1"
BLS12381G2_KEY_NAME = "bls12381g2"
BLS12381G1G2_KEY_NAME = "bls12381g1g2"

ED25519_MULTICODEC_NAME = "ed25519-pub"
X25519_MULTICODEC_NAME = "x25519-pub"
BLS12381G1_MULTICODEC_NAME = "bls12_381-g1-pub"
BLS12381G2_MULTICODEC_NAME = "bls12_381-g2-pub"
BLS12381G1G2_MULTICODEC_NAME = "bls12_381-g1g2-pub"


class TestKeyType(TestCase):
    def test_from_multicodec_name(self):

        assert KeyType.from_multicodec_name(ED25519_MULTICODEC_NAME) == KeyType.ED25519
        assert KeyType.from_multicodec_name(X25519_MULTICODEC_NAME) == KeyType.X25519
        assert (
            KeyType.from_multicodec_name(BLS12381G1_MULTICODEC_NAME)
            == KeyType.BLS12381G1
        )
        assert (
            KeyType.from_multicodec_name(BLS12381G2_MULTICODEC_NAME)
            == KeyType.BLS12381G2
        )
        assert (
            KeyType.from_multicodec_name(BLS12381G1G2_MULTICODEC_NAME)
            == KeyType.BLS12381G1G2
        )
        assert KeyType.from_multicodec_name("non-existing") == None

    def test_from_key_type(self):

        assert KeyType.from_key_type(ED25519_KEY_NAME) == KeyType.ED25519
        assert KeyType.from_key_type(X25519_KEY_NAME) == KeyType.X25519
        assert KeyType.from_key_type(BLS12381G1_KEY_NAME) == KeyType.BLS12381G1
        assert KeyType.from_key_type(BLS12381G2_KEY_NAME) == KeyType.BLS12381G2
        assert KeyType.from_key_type(BLS12381G1G2_KEY_NAME) == KeyType.BLS12381G1G2
        assert KeyType.from_key_type("non-existing") == None

    def test_from_multicodec_prefix(self):

        assert KeyType.from_multicodec_prefix(ED25519_PREFIX_BYTES) == KeyType.ED25519
        assert KeyType.from_multicodec_prefix(X25519_PREFIX_BYTES) == KeyType.X25519
        assert (
            KeyType.from_multicodec_prefix(BLS12381G1_PREFIX_BYTES)
            == KeyType.BLS12381G1
        )
        assert (
            KeyType.from_multicodec_prefix(BLS12381G2_PREFIX_BYTES)
            == KeyType.BLS12381G2
        )
        assert (
            KeyType.from_multicodec_prefix(BLS12381G1G2_PREFIX_BYTES)
            == KeyType.BLS12381G1G2
        )
        assert KeyType.from_multicodec_prefix(b"\xef\x01") == None

    def test_from_prefixed_bytes(self):

        assert (
            KeyType.from_prefixed_bytes(
                b"".join([ED25519_PREFIX_BYTES, b"random-bytes"])
            )
            == KeyType.ED25519
        )
        assert (
            KeyType.from_prefixed_bytes(
                b"".join([X25519_PREFIX_BYTES, b"random-bytes"])
            )
            == KeyType.X25519
        )
        assert (
            KeyType.from_prefixed_bytes(
                b"".join([BLS12381G1_PREFIX_BYTES, b"random-bytes"])
            )
            == KeyType.BLS12381G1
        )
        assert (
            KeyType.from_prefixed_bytes(
                b"".join([BLS12381G2_PREFIX_BYTES, b"random-bytes"])
            )
            == KeyType.BLS12381G2
        )
        assert (
            KeyType.from_prefixed_bytes(
                b"".join([BLS12381G1G2_PREFIX_BYTES, b"random-bytes"])
            )
            == KeyType.BLS12381G1G2
        )
        assert (
            KeyType.from_prefixed_bytes(b"".join([b"\xef\x01", b"other-random-bytes"]))
            == None
        )

    def test_properties(self):
        key_type = KeyType.ED25519

        assert key_type.key_type == ED25519_KEY_NAME
        assert key_type.multicodec_name == ED25519_MULTICODEC_NAME
        assert key_type.multicodec_prefix == ED25519_PREFIX_BYTES
