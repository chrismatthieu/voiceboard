class CreateVoicememos < ActiveRecord::Migration
  def self.up
    create_table :voicememos do |t|
      t.integer :conference_id
      t.string :callerid

      t.timestamps
    end
  end

  def self.down
    drop_table :voicememos
  end
end
