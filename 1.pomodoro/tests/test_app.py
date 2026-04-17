"""Flask アプリケーションのテスト"""

import pytest

from app import create_app


@pytest.fixture
def client():
    """Flask テストクライアントを生成する"""
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_index_status_code(client):
    """GET / がステータスコード 200 を返すことを検証"""
    response = client.get("/")
    assert response.status_code == 200


def test_index_content_type(client):
    """GET / が HTML コンテンツを返すことを検証"""
    response = client.get("/")
    assert "text/html" in response.content_type


def test_index_contains_title(client):
    """GET / のレスポンスにページタイトルが含まれることを検証"""
    response = client.get("/")
    assert "ポモドーロタイマー".encode() in response.data
